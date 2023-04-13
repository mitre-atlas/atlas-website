<template>
  <v-dialog
    v-model="show"
    max-width="500px"
    @click:outside="cancel"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        color="primary"
        text
        v-on="on"
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
        Loading a file will <b>overwrite any existing progress</b> in the form. The current case study schema version is {{ $config.study_schema_version }}.
        <v-file-input
          v-model="chosenFile"
          class="mt-4"
          outlined
          dense
          :error="hasError"
          :error-messages="errorMessages"
          :error-count="5"
          accept=".yaml"
          label="Case study .yaml file"
          @change="validateFileAsync"
          @click:clear="clear"
        >
          <template #selection>
            {{ initialFileName }}
          </template>
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
import { CORE_SCHEMA, load } from 'js-yaml'
import { generateID, validFormatYAML } from '~/assets/tools.js'

/**
 * Dialog for selecting a case study YAML to upload.
 * Validates and passes back the uploaded data and filename.
 */
export default {
  name: 'UploadFileDialog',
  props: [
    /**
     * Whether to open this dialog
     * @type {Boolean}
     */
    'doShow'
  ],
  data () {
    return {
      /**
       * Whether to open this dialog
       * @type {Boolean}
       */
      show: this.doShow,
      /**
       * File selected in file input
       * @type {File}
       */
      chosenFile: null,
      /**
       * Filename of the uploaded file, without the file extension
       * @type {String}
       */
      initialFileName: null,
      /**
       * Whether there is a file validation error
       * @type {Boolean}
       */
      hasError: false,
      /**
       * Any file upload error messages
       * @type {String[]}
       */
      errorMessages: [],
      /**
       * Case study data as read from the uploaded YAML file
       * @type {Object}
       */
      loadedData: {}
    }
  },
  methods: {
    /**
     * Calls `validateFile` asynchronously
     * @param {File} file
     */
    async validateFileAsync (file) {
      // Change event can occur on load/click, also clear
      // Only validate on load/click
      if (this.chosenFile) {
        this.hasError = !await this.validateFile(file)
      }
    },
    // Clear file input, reset error states
    clear () {
      this.hasError = false
      this.errorMessages = []
    },
    // Loads the uploaded file and closes the dialog
    loadDataFromFile () {
      this.loadYaml()
      // Close dialog
      this.show = false
      this.chosenFile = null
    },
    // Loads the uploaded file
    loadYaml () {
      if (this.chosenFile) {
        const reader = new FileReader()
        reader.readAsText(this.chosenFile)
        reader.onload = () => { this.loadData(reader.result) }
      }
    },
    // Resets data
    cancel () {
      this.show = false
      this.chosenFile = null
      this.clear()
    },
    /**
     * Ensures that the uploaded file has expected file properties,
     * then loads the content, validates the content, and collects
     * error messages, if any
     * @todo Reuse the loaded content if possible
     * @param {File} file
     */
    async validateFile (file) {
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
      if (expectedTypes.includes(fileType)) {
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
          const yamlObj = load(tryYamlText, { schema: CORE_SCHEMA })
          const yamlErr = validFormatYAML(yamlObj)
          for (let i = 0; i < yamlErr.length; i++) {
            addError(yamlErr[i])
          }
        } catch (yamlErr) {
          addError(yamlErr.reason)
        }
      }
      this.errorMessages = errors
      return isValid
    },
    /**
     * Parses the file contents into a case study data object
     * @param {String} data
     */
    loadData (data) {
      this.loadedData = load(data)
      /**
       * @arg {object} loadedData - Case study data object
       */
      this.$emit('loaded-data', this.loadedData)
      /**
       * @arg {String} initialFileName - Name of the uploaded file
       */
      this.$emit('loaded-filename', this.initialFileName)
    }
  }
}
</script>
