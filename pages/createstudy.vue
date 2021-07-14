<template>
  <div class="mx-8">
    <!-- <breadcrumbs></breadcrumbs> -->
    <page-title>{{ title }}</page-title>

    <p> To build your case study, either upload a YAML file below and edit as needed, or fill out the following form. </p>
    <v-row>
      <v-col sm="5" class="mb-5">
        <v-file-input
          :error="uploadError"
          :error-messages="uploadErrorMessage"
          v-model="chosenFile"
          small-chips
          accept=".yaml,.yml"
          label="Upload YAML File" />
      </v-col>
      <v-col>
        <v-btn class="my-5" @click="readJSON">
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
          <v-col sm="5" class="pl-0">
            <v-text-field v-model="meta.email" :rules="emailRules" label="E-mail" required @input="updateValue(meta.email)" />
          </v-col>

          <v-spacer />

          <v-col sm="7">
            <v-text-field v-model="reported" :rules="[v => !!v || 'Reporter is required']" label="Reported by" required @input="updateValue(reported)" />
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="4" class="pl-0">
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
                  label="Incident date"
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

      <add-procedure-step :select-tactic="selectTactic" :select-technique="selectTechnique" :description="description" @clicked="addProcedureStep" />
      <edit-procedure :key="procedure" :procedure="procedure" @updateProcedure="procedure = $event" />

      <add-source :source-description="sourceDescription" :url="url" @clicked="addSource" />

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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { deepCopy, dateToString, generateID, yamlParse, validFormatYAML, downloadStudyFile } from 'static/data/tools.js'

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
      meta: { email: '' },
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
      uploadErrorMessage: [],
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
    ...mapActions(['submitCaseStudy']),
    updateValue (inputVal) {
      this.inputVal = inputVal
    },
    loadData (data) {
      const studyFileObj = (typeof data === 'object') ? data : yamlParse(data)
      const inputStudy = 'meta' in studyFileObj ? studyFileObj.study : studyFileObj
      this.meta = studyFileObj.meta ?? this.meta
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
    },
    async readJSON () {
      if (!(this.chosenFile)) {
        console.log('nothing inputted')
      } else {
        this.uploadError = false
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
      const expectedTypes = ['.yaml', '.yml']
      const MB_TO_B = 1000000
      const megabyteLimit = 20
      const maxSize = MB_TO_B * megabyteLimit // the last number is in megabytes, the first converts it to bytes
      const fileSize = file.size
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
      if (expectedTypes.includes(fileType)) { // nominal
        Object.defineProperty(file, 'name', { // prevents buffer overflow attack via name prop
          writable: true,
          value: generateID() + '.yaml'
        })
      } else {
        addError('Invalid file type')
      }
      if (fileSize <= 0) {
        addError('Invalid file')
      } else if (fileSize <= maxSize) { // nominal
      } else {
        addError(`File too large (${megabyteLimit} MB limit)`)
      }
      // turns out file.type doesn't check the bytestream to ensure mime type (only looks at ext) so
      // below will try to see if it can get a json out
      // only check if the other tests pass
      if (isValid) {
        const tryYamlText = await file.text()
        try {
          yamlParse(tryYamlText)
          // can i add if !object here?
          if (!(typeof tryYamlText === 'object' || typeof yamlParse(tryYamlText) === 'object')) {
            addError('Invalid YAML')
          }
        } catch (e) {
          addError('Invalid YAML')
        }
        // PSEUDO FOR YAML VALIDATE
        // if (!correct yaml)
        // addError('Incorrectly formatted YAML')
        const yamlErr = validFormatYAML(yamlParse(tryYamlText))
        if (yamlErr !== '') {
          addError(yamlErr)
        }
      }

      this.uploadErrorMessage = errors
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
    addProcedureStep (newStep) {
      this.procedure.push(newStep)
    },
    addSource (newSource) {
      this.references.push(newSource)
    },
    submitStudy () {
      if (this.$refs.form.validate() && this.procedure.length) {
        this.errorMsg = ''
        const nowDate = new Date()
        const nowDateString = dateToString(nowDate, true)
        this.meta['date-created'] = this.meta['date-created'] ?? nowDateString
        this.meta['date-updated'] = nowDateString
        this.meta.uuid = this.meta.uuid ?? generateID()
        const study = {
          meta: this.meta,
          study: {
            name: this.titleStudy,
            summary: this.summary,
            'incident-date': this.date,
            procedure: deepCopy(this.procedure),
            'reported-by': this.reported,
            references: deepCopy(this.references)
          }
        }
        // next 2 lines call actions to create store case study object and download file
        // this.submitCaseStudy(study) // <-- stores case study in store
        downloadStudyFile(study)
        this.submissionMsg = 'Your case study has been downloaded! Email your yaml file to '
      } else if (!this.$refs.form.validate()) {
        this.errorMsg = 'Please complete all required fields'
      } else if (!this.procedure.length) {
        this.errorMsg = 'Please add at least one procedure step'
      }
    }
  }
}
</script>
