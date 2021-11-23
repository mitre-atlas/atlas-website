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
            @click="show = false"
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
    },
    loadYaml () {
      if (this.chosenFile) {
        const reader = new FileReader()
        reader.readAsText(this.chosenFile)
        reader.onload = () => { this.loadData(reader.result) }
      }
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
      }

      // Check file extension (though accept prop is in effect)
      // Rename file name to prevent XSS
      if (expectedTypes.includes(fileType)) { // nominal
        // https://blog.yeswehack.com/yeswerhackers/file-upload-attacks-part-2/
        this.initialFileName = file.name
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
    editReferences (refs) {
      // this function takes in an array of strings and converts them to an array of formatted objects
      const structuredRefs = []
      for (let i = 0; i < refs.length; i++) {
        const matches = refs[i].match(/(https?:\/\/[^ ]*)/)
        let thisRef = { sourceDescription: '', url: '' }
        if (matches) {
          thisRef = { sourceDescription: refs[i].replace(matches[1], ''), url: matches[1] }
        } else {
          thisRef = { sourceDescription: refs[i], url: '' }
        }
        structuredRefs.push(thisRef)
      }
      return structuredRefs
    },
    loadData (data) {
      const studyFileObj = (typeof data === 'object') ? data : yamlParse(data)
      const inputStudy = 'meta' in studyFileObj ? studyFileObj.study : studyFileObj
      this.loadedData.meta = studyFileObj.meta ?? this.loadedData.meta
      this.loadedData.titleStudy = inputStudy.name
      this.loadedData.summary = inputStudy.summary

      // Parse incident date
      if (typeof inputStudy['incident-date'] === 'string') {
        // Maintain compatibility with older string format
        if (inputStudy['incident-date'].length > 4) {
          // Split into string tokens
          const [yearStr, monthStr, dateStr] = inputStudy['incident-date'].split('-')
          // Parse tokens into ints
          const year = parseInt(yearStr)
          const monthIndex = parseInt(monthStr) - 1
          const day = parseInt(dateStr)
          // Create Date in UTC
          this.loadedData.date = new Date(Date.UTC(year, monthIndex, day))
        }
      } else if (typeof inputStudy['incident-date'] === 'object') {
        // Date
        this.loadedData.date = inputStudy['incident-date']
      }

      // Key that defines how specific the date input was
      if ('incident-date-granularity' in inputStudy) {
        // Expecting YEAR, MONTH, or DATE
        this.loadedData.dateGranularity = inputStudy['incident-date-granularity']
      } else {
        // No date granularity at this time, assume to be most specific
        this.loadedData.dateGranularity = 'DATE'
      }
      // console.log('Load Data: ' + this.year + '-' + this.month + '-' + this.date)

      this.loadedData.procedure = inputStudy.procedure
      this.loadedData.reported = inputStudy['reported-by']
      if (inputStudy.references === [] || !(inputStudy.references)) {
        this.loadedData.references = []
      } else if (typeof inputStudy.references[0] === 'string') {
        this.loadedData.references = this.editReferences(inputStudy.references)
      } else if (typeof inputStudy.references[0] === 'object') {
        this.loadedData.references = inputStudy.references
      }

      this.$emit('loaded-data', this.loadedData)
    }
  }
}
</script>
