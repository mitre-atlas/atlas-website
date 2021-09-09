<template>
  <div class="mx-8">
    <breadcrumbs />

    <v-btn
      class="my-5"
      outlined
      color="red"
      absolute
      right
      :disabled="!valid"
      @click="clearForm"
    >
      Clear Form
    </v-btn>
    <page-title>{{ title }}</page-title>

    <h3 class="font-weight-medium">1. Upload File</h3>
    <div class="ml-6">If you already have a .yaml file, submit your case study here and edit in the form as needed.</div>
    <v-row>
      <v-col sm="5">
        <v-file-input
          v-model="chosenFile"
          class="mb-10"
          :error="uploadError"
          :error-messages="uploadErrorMessage"
          small-chips
          accept=".yaml,.yml"
          label="Upload YAML File"
          @change="readJSON"
        >
          <template v-slot:selection><v-chip small>{{ initialFileName }}</v-chip></template>
        </v-file-input>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="valid" lazy-validation>
      <h3 class="font-weight-medium">2. Complete Fields</h3>
      <div class="ml-6">Fill out each field with case study data.</div>
      <v-container  class="mb-10">
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

        <!-- <v-subheader>
          Incident date
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  right
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-help-circle-outline
                </v-icon>
            </template>
            <span>Only the year is required, but please specify month and day where possible.</span>
          </v-tooltip>
        </v-subheader> -->

        <!-- <date-select
          :key="year"
          :year="year"
          :month="month"
          :date="date"
          @yearUpdate="year = $event"
          @monthUpdate="month = $event"
          @dateUpdate="date = $event"
        /> -->

        <incident-date-picker :startDate="date" v-on:selectedDate="setIncidentDate"/>

        <v-row>
          <v-textarea v-model="summary" :rules="[v => !!v || 'Summary is required']" label="Summary" required @input="updateValue(summary)" />
        </v-row>
      </v-container>

      <h3 class="font-weight-medium">3. Procedure</h3>
      <div class="ml-6">Add procedure steps to your case study, each containing a tactic, technique, and description.</div>
      <edit-procedure class="mx-8" :key="procedure" :procedure="procedure" @updateProcedure="procedure = $event" />
      <add-procedure-step
        class="mb-16 mx-8"
        v-if="addingStep"
        ref="addProcStepRef"
        :select-tactic="selectTactic"
        :select-technique="selectTechnique"
        :description="description"
        :addingStep="addingStep"
        @clicked="addProcedureStep"
        @addingBoolUpdate="addingStep = $event"
      />
      <div v-else>
        <v-btn class="ma-2 mb-10" outlined color="blue" @click="addingStep = true">Add New Step</v-btn>
      </div>

      <h3 class="font-weight-medium">4. References</h3>
      <div class="ml-6">Optionally add references to your case study, each containing a source and/or url.</div>
      <div v-if="references.length" class="mx-8">
        <v-list flat>
          <v-list-item-group>
          <div v-for="(value, key) in references" :key="key">
            <toggleable-source :source="value" :index="key" @clicked="addSourceAt" v-on:delete="deleteSourceAt"/>
          </div>
          </v-list-item-group>
        </v-list>

      </div>
      <add-source
        class="mx-8"
        v-if="addingSource"
        ref="addSourceRef"
        :source-description="sourceDescription"
        :url="url"
        @clicked="addSource"
        @addingBoolUpdate="addingSource = $event"
      />
      <div v-else>
        <v-btn class="ma-2 mb-10" outlined color="blue" @click="addingSource = true">Add New Source</v-btn>
      </div>

      <v-tooltip right color="light-blue lighten-4">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="my-5"
            outlined
            :disabled="!valid"
            v-bind="attrs"
            x-large
            v-on="on"
            @click="submitStudy"
          >
            Download Case Study
          </v-btn>
        </template>
        <span :style="{ color: 'black' }">Email your downloaded yaml file to <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a></span>
      </v-tooltip>
      <download-powerpoint v-if="downloadedYaml" :study="study" :builder="builder" />
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

<router>
  {
    path: '/studies/create'
  }
</router>

<script>
import { mapActions, mapGetters } from 'vuex'
import { deepCopy, generateID, yamlParse, validFormatYAML, downloadStudyFile } from 'static/data/tools.js'

export default {
  data () {
    return {
      title: 'Create A Case Study',
      valid: true,
      chosenFile: null,
      initialFileName: '',
      date: null,
      dateGranularity: null,
      selectTactic: null,
      selectTechnique: null,
      description: '',
      titleStudy: '',
      meta: { email: '' },
      study: null,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      summary: '',
      sourceDescription: '',
      url: '',
      reported: '',
      procedure: [],
      addingStep: true,
      references: [],
      addingSource: true,
      errorMsg: '',
      uploadError: false,
      uploadErrorMessage: [],
      submissionMsg: '',
      downloadedYaml: false,
      builder: true,
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
          this.date = new Date(Date.UTC(year, monthIndex, day))
        }
      } else if (typeof inputStudy['incident-date'] === 'object') {
        // Date
        this.date = inputStudy['incident-date']
      }

      // Key that defines how specific the date input was
      if ('incident-date-granularity' in inputStudy) {
        // Expecting YEAR, MONTH, or DATE
        this.dateGranularity = inputStudy['incident-date-granularity']
      } else {
        // No date granularity at this time, assume to be most specific
        this.dateGranularity = 'DATE'
      }
      // console.log('Load Data: ' + this.year + '-' + this.month + '-' + this.date)

      this.procedure = inputStudy.procedure
      this.reported = inputStudy['reported-by']
      if (inputStudy.references === [] || !(inputStudy.references)) {
        this.references = []
      } else if (typeof inputStudy.references[0] === 'string') {
        this.references = this.editReferences(inputStudy.references)
      } else if (typeof inputStudy.references[0] === 'object') {
        this.references = inputStudy.references
      }
      if (this.procedure !== []) {
        this.addingStep = false
      }
      if (this.references !== []) {
        this.addingSource = false
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
        this.initialFileName = file.name
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

      this.uploadErrorMessage = errors
      return isValid
    },
    setIncidentDate (date, granularity) {
      // Called from incident date picker
      this.date = date
      this.dateGranularity = granularity
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
      this.addingStep = false
    },
    addSource (newSource) {
      this.references.push(newSource)
      this.addingSource = false
    },
    addSourceAt (newSource, index) {
      this.references.splice(index, 1, newSource)
      this.addingSource = false
    },
    deleteSourceAt (index) {
      this.references.splice(index, 1)
      this.addingSource = false
    },
    clearForm () {
      if (this.addingStep) {
        this.$refs.addProcStepRef.clearStepInput()
      }
      if (this.addingSource) {
        this.$refs.addSourceRef.clearSource()
      }
      this.valid = true
      this.chosenFile = null
      this.initialFileName = '' // IS THIS DOING ANYTHING
      this.year = null
      this.month = null
      this.date = null
      this.dateGranularity = null
      this.titleStudy = ''
      this.meta = { email: '' }
      this.study = null
      this.summary = ''
      this.reported = ''
      this.procedure = []
      this.addingStep = true
      this.references = []
      this.addingSource = true
      this.errorMsg = ''
      this.uploadError = false
      this.uploadErrorMessage = []
      this.submissionMsg = ''
      this.downloadedYaml = false
      this.builder = true
      this.$refs.form.resetValidation()
    },
    submitStudy () {
      if (this.$refs.form.validate() && this.procedure.length) {
        this.errorMsg = ''

        // Metadata
        const nowDate = new Date()
        // Maintain backwards compatibility with JS Date string format
        if (this.meta['date-created'] && typeof this.meta['date-created'] === 'string') {
          // Parse the JS Date string, i.e 2021-8-24 1:22:23 PM UTC
          const dateCreated = new Date(this.meta['date-created'])
          // Set field to the date itself, which renders as an ISO date
          this.meta['date-created'] = dateCreated
        }
        // Only set the date-created once upon study creation
        this.meta['date-created'] = this.meta['date-created'] ?? nowDate
        // Always update date-updated
        this.meta['date-updated'] = nowDate
        this.meta.uuid = this.meta.uuid ?? generateID()

        const study = {
          meta: this.meta,
          study: {
            name: this.titleStudy,
            summary: this.summary,
            'incident-date': this.date,
            'incident-date-granularity': this.dateGranularity,
            procedure: deepCopy(this.procedure),
            'reported-by': this.reported,
            references: deepCopy(this.references)
          }
        }
        // next 2 lines call actions to create store case study object and download file
        // this.submitCaseStudy(study) // <-- stores case study in store
        downloadStudyFile(study)
        this.downloadedYaml = true
        this.study = study
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
