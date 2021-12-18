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
        <upload-file-dialog @loaded-data="setDataFromFile" />
        <v-spacer />
        <instructions-dialog />
    </v-card-actions>

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
        />

        <v-text-field
          v-model="reported"
          :rules="rules.reportedBy"
          label="Reported by"
          hint="Name(s) of the original authors of the study"
          prepend-inner-icon="mdi-account"
          outlined
          required
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
        <v-row>
          <v-col
            cols="12"
            sm="3"
            md="6"
          >
            <div>
            <v-text-field
              v-model="fileName"
              :rules="rules.fileName"
              label="Case Study File Name"
              hint="Name or change case study file name to be downloaded"
              prepend-inner-icon="mdi-file-download"
              outlined
              clearable
              required
              auto-grow
            />
              <v-alert
                v-if="errorMsg"
                text
                color="red"
                type="error"
                dense
                >
                {{ errorMsg }}
              </v-alert>
            </div>
            <div style="float: left;">
              <v-tooltip>
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
                <!-- <span :style="{ color: 'black' }">Email the downloaded .yaml file to <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a></span> -->
              </v-tooltip>
              <download-powerpoint v-if="downloadedYaml" :study="study" :builder="builder" />
              <v-alert
                v-if="submissionMsg"
                text
                color="green"
                type="success"
                dense
                >
                {{ submissionMsg }} <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
              </v-alert>
            </div>
            </v-col>
          </v-row>
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
import { deepCopy, generateID, downloadStudyFile } from 'static/data/tools.js'

export default {
  data () {
    return {
      title: 'Create A Case Study',
      valid: true,
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
      submissionMsg: '',
      fileName: '',
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
        'incidentDate',
        'fileName'
      ]
    }
  },
  beforeMount () {
    window.addEventListener('beforeunload', this.handleBeforeUnload)
    window.addEventListener('popstate', this.handleBackButton)
  },
  computed: {
    ...mapGetters(['getCaseStudyBuilderData'])
  },
  // mounted () {
  // Restores case study data from store
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
  beforeRouteLeave (to, from, next) {
    if (this.to && this.dialog === false && this.isEditing) {
      next()
    } else {
      next(false)
      this.to = to
      this.dialog = true
    }
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    window.removeEventListener('popstate', this.handleBackButton)
  },
  methods: {
    ...mapActions(['submitCaseStudy']),
    setDataFromFile (data) {
      // Directly set proprties on this instance
      Object.assign(this, data)

      // Collapse forms into buttons as needed
      if (this.procedure !== []) {
        this.addingStep = false
      }
      if (this.references !== []) {
        this.addingSource = false
      }
      if (this.titleStudy) {
        this.fileName = this.titleStudy
      }
    },
    setIncidentDate (date, granularity) {
      // Called from incident date picker
      this.date = date
      this.dateGranularity = granularity
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
            name: this.fileName,
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
    },
    handleBeforeUnload (event) {
      if (!this.isEditing) {
        return
      }
      event.preventDefault()
      event.returnValue = ''
    }
  }
}
</script>
