<template>
  <div class="mx-8">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <navigation-dialog
        @close="closeDialog"
        @leave-page="leavePage"
      />
    </v-dialog>
    <breadcrumbs />
    <page-title>{{ title }}</page-title>

    <v-card-actions>
        <instructions-dialog />
    </v-card-actions>

    <v-card flat>
      <v-card-text>
        <v-row align="center" justify="start">
          <v-col cols="12" md="4">
            <div>Upload an existing case study (optional)</div>
          </v-col>
          <v-col cols="12" md="8" sm="12">
            <v-file-input
              v-model="chosenFile"
              :error="uploadError"
              :error-messages="uploadErrorMessage"
              small-chips
              accept=".yaml,.yml"
              label="Case study .yaml file"
              @change="readJSON"
              hide-details
            >
              <template v-slot:selection><v-chip small>{{ initialFileName }}</v-chip></template>
            </v-file-input>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card flat>
        <v-card-title>Details</v-card-title>
        <v-card-subtitle>All fields required.</v-card-subtitle>

        <v-card-text>
        <v-text-field
          v-model="titleStudy"
          :rules="rules.title"
          label="Title"
          hint="Name for this case study"
          prepend-inner-icon="mdi-format-title"
          outlined
          required
          @input="updateValue(titleStudy)"
        />

        <v-text-field
          v-model="meta.email"
          :rules="emailRules"
          :validate-on-blur="true"
          label="Contact email(s)"
          hint="Emails are for correspondence about this case study submission and will not be published"
          prepend-inner-icon="mdi-email"
          type="email"
          outlined
          required
          @input="updateValue(meta.email)"
        />

        <v-text-field
          v-model="reported"
          :rules="rules.reportedBy"
          label="Reported by"
          hint="Name(s) of the original authors of the study"
          prepend-inner-icon="mdi-account"
          outlined
          required
          @input="updateValue(reported)"
        />

        <incident-date-picker
          :startDate="date"
          :startDateGranularity="dateGranularity"
          :initialRules="rules.incidentDate"
          v-on:selectedDate="setIncidentDate"
        />

        <v-textarea
          v-model="summary"
          :rules="rules.summary"
          label="Summary"
          hint="Description of the incident"
          prepend-inner-icon="mdi-text"
          outlined
          required
          auto-grow
          @input="updateValue(summary)"
        />
        </v-card-text>

      <v-card-title>Procedure</v-card-title>
      <v-card-subtitle>Construct a timeline of the incident, mapped to MITRE ATLAS&trade; and/or MITRE ATTACK<sup>&reg;</sup> Enterprise techniques. Add at least one step.</v-card-subtitle>
      <v-card-text>
        <edit-procedure class="mx-8" :key="procedure" :procedure="procedure" @updateProcedure="procedure = $event" />
        <add-procedure-step
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
          <v-btn class="ma-2 mb-10" @click="addingStep = true">
            <v-icon left>
              mdi-plus
            </v-icon>
            Add New Step
          </v-btn>
        </div>
      </v-card-text>

      <v-card-title>References</v-card-title>
      <v-card-subtitle>Optionally list sources for this case study.</v-card-subtitle>
      <v-card-text>
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
          v-if="addingSource"
          ref="addSourceRef"
          :source-description="sourceDescription"
          :url="url"
          @clicked="addSource"
          @addingBoolUpdate="addingSource = $event"
        />
        <div v-else>
          <v-btn class="ma-2 mb-10" @click="addingSource = true">
            <v-icon left>
              mdi-plus
            </v-icon>
            Add New Source
          </v-btn>
        </div>
      </v-card-text>

      <v-card-text>
        <v-tooltip top color="light-blue lighten-4">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              :disabled="!valid"
              v-bind="attrs"
              v-on="on"
              @click="submitStudy"
            >
              <v-icon left>
              mdi-download
              </v-icon>
              Download Case Study
            </v-btn>
          </template>
          <span :style="{ color: 'black' }">Email the downloaded .yaml file to <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a></span>
        </v-tooltip>

        <download-powerpoint v-if="downloadedYaml" :study="study" :builder="builder" />

        <v-alert
          v-if="errorMsg"
          text
          color="red"
          type="error"
          dense
          >
          {{ errorMsg }}
        </v-alert>
        <v-alert
          v-if="submissionMsg"
          text
          color="green"
          type="success"
          dense
          >
          {{ submissionMsg }} <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
        </v-alert>

        </v-card-text>
      </v-card>
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
        v => /^$|.+@.+\..+/.test(v) || 'E-mail must be valid' // Matches empty string or x@y.z
      ],
      summary: '',
      sourceDescription: '',
      url: '',
      reported: '',
      procedure: [],
      addingStep: true,
      references: [],
      addingSource: false,
      errorMsg: '',
      uploadError: false,
      uploadErrorMessage: [],
      submissionMsg: '',
      downloadedYaml: false,
      builder: true,
      contactEmail: 'atlas@mitre.org',
      dialog: false,
      to: null,
      isEditing: false,

      rules: {}, // Initial empty obj bound to field rules prop - must start empty
      requiredRule: v => !!v || 'Required',
      requiredFieldRuleKeys: [
        'title',
        'reportedBy',
        'summary',
        'incidentDate'
      ]
    }
  },
  beforeMount () {
    window.addEventListener('beforeunload', (event) => {
      if (!this.isEditing) {
        return
      }
      event.preventDefault()
      event.returnValue = ''
    })
  },
  computed: {
    ...mapGetters(['getCaseStudyBuilderData'])
  },
  mounted () {
    window.addEventListener('popstate', this.handleBackButton) // Restores case study data from store
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
  },
  beforeRouteLeave (to, from, next) {
    if (this.to && this.dialog === false && this.isEditing) {
      next()
    } else {
      next(false)
      this.to = to
      this.dialog = true
    }
  },
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
    submitStudy () {
      this.requiredFieldRuleKeys.forEach((key) => {
        this.rules[key] = [this.requiredRule]
      })
      // Email already has a rule in place, add required to the front
      this.emailRules.unshift(this.requiredRule)

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
    },
    closeDialog () {
      this.dialog = false
      this.isEditing = true
      this.to = null
    },
    leavePage () {
      this.dialog = false
      this.isEditing = true
      this.$router.push(this.to)
    },
    handleBackButton () {
      this.dialog = true
    }
  }
}
</script>
