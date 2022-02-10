<template>
  <v-dialog
      v-model="show"
      max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          color="primary"
          text
        >
          <v-icon left>
            mdi-upload
          </v-icon>
          Load case study
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Load case study</v-card-title>

          <v-card-text>
              To view or edit an existing case study, upload a .yaml file created by this website.

              <v-file-input
                class="mt-4"
                outlined
                dense
                v-model="chosenFile"
                @change="validateFileAsync"
                @click:clear="clear"
                :error="hasError"
                :error-messages="errorMessages"
                accept=".yaml"
                label="Case study .yaml file"
            >
            <template v-slot:selection>{{ initialFileName }}</template>
            </v-file-input>

        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            plain
            color="grey"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            plain
            color="primary"
            :disabled="hasError || !chosenFile"
            @click="loadDataFromFile"
            >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
import { generateID, yamlParse, validFormatYAML } from 'static/data/tools.js'

export default {
  name: 'UploadFileDialog',
  props: [
    'doShow'
  ],
  data () {
    return {
      show: this.doShow,
      chosenFile: null,
      initialFileName: null,
      hasError: false,
      errorMessages: [],
      loadedData: {}
    }
  },
  methods: {
    async validateFileAsync (file) {
      // Change event can occur on load/click, also clear
      // Only validate on load/click
      if (this.chosenFile) {
        this.hasError = !await this.validateFile(file)
      }
    },
    clear () {
      // Clear file input, reset error states
      this.hasError = false
      this.errorMessages = []
    },
    loadDataFromFile () {
      this.loadYaml()
      // Close dialog
      this.show = false
      this.chosenFile = null
    },
    loadYaml () {
      if (this.chosenFile) {
        const reader = new FileReader()
        reader.readAsText(this.chosenFile)
        reader.onload = () => { this.loadData(reader.result) }
      }
    },
    cancel () {
      this.show = false
      this.chosenFile = null
      this.hasError = false
      this.errorMessages = []
    },
    async validateFile (file) {
      // did some testing and it seems Vue automatically escapes special charatcers when inserting into HTML
      // does that mean we're fully safe from XSS attacks?
      const expectedTypes = ['.yaml']

      let fileType = ''
      const errors = []
      let isValid = true
      const addError = (s) => {
        isValid = false
        errors.push(s)
      }
      const extStartIndex = file.name.lastIndexOf('.')
      if (extStartIndex >= 0) {
        fileType = file.name.slice(extStartIndex)
        // Filename without extension
        this.initialFileName = file.name.substring(0, extStartIndex)
      }

      // Check file extension (though accept prop is in effect)
      // Rename file name to prevent XSS
      if (expectedTypes.includes(fileType)) { // nominal
        // https://blog.yeswehack.com/yeswerhackers/file-upload-attacks-part-2/

        Object.defineProperty(file, 'name', { // prevents buffer overflow attack via name prop
          writable: true,
          value: generateID() + '.yaml'
        })
      } else {
        addError(`Invalid file type: expected .yaml, got ${fileType}`)
      }

      // Check file size
      const MB_TO_B = 1000000
      const megabyteLimit = 2
      const maxSize = MB_TO_B * megabyteLimit // the last number is in megabytes, the first converts it to bytes
      const fileSize = file.size
      if (fileSize <= 0) {
        addError('Invalid file')
      } else if (fileSize <= maxSize) { // nominal
      } else {
        addError(`File too large, (${megabyteLimit} MB limit)`)
      }
      // turns out file.type doesn't check the bytestream to ensure mime type (only looks at ext) so
      // below will try to see if it can get a json out
      // only check if the other tests pass
      if (isValid) {
        const tryYamlText = await file.text()
        try {
          yamlParse(tryYamlText)
          if (!(typeof tryYamlText === 'object' || typeof yamlParse(tryYamlText) === 'object')) {
            addError('Invalid YAML')
          }
        } catch (e) {
          addError('Invalid YAML')
        }
        const yamlErr = validFormatYAML(yamlParse(tryYamlText))
        if (yamlErr !== '') {
          addError(yamlErr)
        }
      }

      this.errorMessages = errors
      return isValid
    },
    loadData (data) {
      this.loadedData = yamlParse(data)

      // Handle format change from standalone data
      if (this.loadedData.study.references && this.loadedData.study.references.length > 0 && 'sourceDescription' in this.loadedData.study.references[0]) {
        // The reference object key "sourceDescription" is now expected to be "title"
        this.loadedData.study.references.map((obj) => {
          obj.title = obj.sourceDescription
          delete obj.sourceDescription
          return obj
        })
      }

      this.$emit('loaded-data', this.loadedData)
      this.$emit('loaded-filename', this.initialFileName)
    }
  }
}
</script>
