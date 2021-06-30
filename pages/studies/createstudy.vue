<template>
  <div>
    <!-- <breadcrumbs></breadcrumbs> -->
    <page-title>{{ title }}</page-title>

    <p> To build your case study, either upload a JSON file below and edit as needed, or fill out the following form. </p>
    <v-row>
      <v-col sm="5" class="mb-5">
        <v-file-input v-model="chosenFile" small-chips accept=".json" label="Upload JSON File" />
      </v-col>
      <v-col>
        <v-btn @click="readJSON">
          Populate Form
        </v-btn>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row>
          <v-text-field v-model="titleStudy" :rules="[v => !!v || 'Title is required']" label="Title" required @input="updateValue(titleStudy)" />
        </v-row>

        <v-row>
          <v-col sm="6">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required @input="updateValue(email)" />
          </v-col>

          <v-spacer />

          <v-col sm="6">
            <v-text-field v-model="reported" :rules="[v => !!v || 'Reporter is required']" label="Reported by:" required @input="updateValue(reported)" />
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="4">
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Incident date:"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="date"
                @input="dateMenu = false"
              />
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-textarea v-model="summary" :rules="[v => !!v || 'Summary is required']" label="Summary" required @input="updateValue(summary)" />
        </v-row>
      </v-container>

      <add-procedure-step :selectTactic="selectTactic" :selectTechnique="selectTechnique" :description="description" @clicked="addProcedureStep" />
      <edit-procedure :procedure="procedure" :key="procedure" />

      <add-source :sourceDescription="sourceDescription" :url="url" @clicked="addSource" />

      <div v-if="references.length" class="mx-8">
        <ol>
          <li v-for="(value, key) in references" :key="key">
            {{ value.sourceDescription }}
            <p v-linkified>
              {{ value.url }}
            </p>
          </li>
        </ol>
      </div>

      <v-btn class="my-5" outlined :disabled="!valid" x-large @click="submitStudy">
        Download Case Study
      </v-btn>
      <v-col sm="6">
        <v-alert v-if="errorMsg" color="red" outlined type="error" dense>
          {{ errorMsg }}
        </v-alert>
        <v-alert v-if="submissionMsg" color="green" outlined type="success" dense>
          {{ submissionMsg }} <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
        </v-alert>
      </v-col>
    </v-form>
    <v-snackbar
      class="mt-4"
      top
      text
      color="error"
      outlined
      timeout=3000
      v-model="uploadError">{{uploadErrorMessage }}</v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { deepCopy, generateID } from 'static/data/tools.js'

export default {
  data () {
    return {
      title: 'Create A Case Study',
      valid: true,
      chosenFile: null,
      date: new Date().toISOString().substr(0, 10),
      dateMenu: false,
      selectTactic: null,
      selectTechnique: null,
      description: '',
      titleStudy: '',
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      summary: '',
      sourceDescription: '',
      url: '',
      reported: '',
      procedure: [],
      references: [],
      errorMsg: '',
      uploadError: false,
      uploadErrorMessage: '',
      submissionMsg: '',
      contactEmail: 'atlas@mitre.org'
    }
  },
  computed: {
    ...mapGetters(['getCaseStudyBuilderData'])
  },
  // mounted () { //Restores case study data from store
  //   // this.$nextTick(function () {
  //   //   // todo: fix getter, shouldn't have to do this?
  //   //   const storedCaseStudy = this.getCaseStudyBuilderData ? this.getCaseStudyBuilderData.study : null
  //   //   if (storedCaseStudy) {
  //   //     console.log('Case study found in store. Loading...')
  //   //     this.loadData(storedCaseStudy)
  //   //   } else {
  //   //     console.log('No case study found in store')
  //   //   }
  //   // })
  // },
  methods: {
    ...mapActions(['submitCaseStudy', 'createStudyFile']),
    updateValue (inputVal) {
      this.inputVal = inputVal
    },
    loadData (data) {
      console.log('loading:', data)
      const inputStudy = (typeof data === 'object') ? data : JSON.parse(data)
      this.titleStudy = inputStudy.name
      this.summary = inputStudy.summary
      this.date = inputStudy['incident-date']
      this.procedure = inputStudy.procedure
      this.reported = inputStudy['reported-by']
      if (inputStudy.references === [] || !(inputStudy.references)) {
        this.references = []
      } else if (typeof inputStudy.references[0] === 'string') {
        this.references = this.editReferences(inputStudy.references)
      } else if (typeof inputStudy.references[0] === 'object') {
        this.references = inputStudy.references
      }
      console.log('here')
    },
    async readJSON () {
      if (!(this.chosenFile)) {
        console.log('nothing inputted')
      } else {
        const isValidFile = await this.validateFile(this.chosenFile)

        if (!isValidFile) {
          this.uploadError = true
          return
        }

        const reader = new FileReader()
        reader.readAsText(this.chosenFile)
        reader.onload = () => { this.loadData(reader.result) }
      }
    },
    async validateFile (file) {
      // did some testing and it seems Vue automatically escapes special charatcers when inserting into HTML
      // does that mean we're fully safe from XSS attacks?
      const expectedTypes = ['application/json', 'text/json']
      const KB_TO_B = 1000
      const MB_TO_B = 1000000
      const maxSize = MB_TO_B * 20 // the last number is in megabytes, the first converts it to bytes

      const fileType = file.type
      const fileSize = file.size

      this.uploadErrorMessage = ''
      const addError = (s) => { this.uploadErrorMessage += s + ', ' }

      if (expectedTypes.includes(fileType)) { // nominal
        console.log(`fileType OK: (${fileType})`)
        Object.defineProperty(file, 'name', { // prevents buffer overflow attack via name prop
          writable: true,
          value: generateID() + '.json'
        })
      } else {
        console.log(`fileType mismatch: (${fileType})`)
        addError('invalid file type')
      }

      if (fileSize <= 0) {
        console.log(`fileSize empty: (${fileSize} bytes)`)
        addError('invalid file')
      } else if (fileSize <= maxSize) { // nominal
        console.log(`fileSize OK: (${fileSize / KB_TO_B} kilobytes)`)
      } else {
        console.log(`fileSize overflow: (${fileSize / KB_TO_B} kilobytes)`)
        addError('file too large')
      }

      // turns out file.type doesn't check the bytestream to ensure mime type (only looks at ext) so
      // below will try to see if it can get a json out
      // only check if the other tests pass
      if (!this.uploadErrorMessage) {
        const tryJSONText = await file.text()
        try {
          JSON.parse(tryJSONText)
          console.log('fileJSON OK')
        } catch (e) {
          console.log('fileJSON error')
          addError('invalid JSON')
        }
      }

      this.uploadErrorMessage = this.uploadErrorMessage ? this.uploadErrorMessage.charAt(0).toUpperCase() + this.uploadErrorMessage.slice(1, -2) : ''

      return !this.uploadErrorMessage
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
    addProcedureStep (newStep) {
      this.procedure.push(newStep)
    },
    addSource (newSource) {
      this.references.push(newSource)
    },
    submitStudy () {
      if (this.$refs.form.validate() && this.procedure.length) {
        this.errorMsg = ''
        const study = {
          // id: ,
          name: this.titleStudy,
          // object-type: 'case-study',
          summary: this.summary,
          'incident-date': this.date,
          procedure: deepCopy(this.procedure),
          'reported-by': this.reported,
          references: deepCopy(this.references)
        }
        // next 2 lines call actions to create store case study object and download file
        this.createStudyFile(study)
        this.submissionMsg = 'Your case study has been downloaded! Email your json file to '
      } else if (!this.$refs.form.validate()) {
        this.errorMsg = 'Please complete all required fields'
      } else if (!this.procedure.length) {
        this.errorMsg = 'Please add at least one procedure step'
      }
    }
  }
}
</script>
