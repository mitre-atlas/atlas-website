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
      <upload-file-dialog
        @loaded-data="setDataFromFile"
        @loaded-filename="setFileName"
      />
      <v-spacer />
      <instructions-dialog />
    </v-card-actions>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card flat>
        <v-card-title>Details</v-card-title>
        <v-card-subtitle>All fields required.</v-card-subtitle>

        <v-card-text>
          <v-text-field
            v-model="studyData.study.name"
            :rules="rules.title"
            label="Title"
            hint="Name for this case study"
            prepend-inner-icon="mdi-format-title"
            outlined
            required
          />

          <v-text-field
            v-model="studyData.study['reported-by']"
            :rules="rules.reportedBy"
            label="Reported by"
            hint="Name(s) of the original authors of the study"
            prepend-inner-icon="mdi-account"
            outlined
            required
          />

          <incident-date-picker
            :start-date="studyData.study['incident-date']"
            :start-date-granularity="studyData.study['incident-date-granularity']"
            :initial-rules="rules.incidentDate"
            @selectedDate="setIncidentDate"
          />

          <v-textarea
            v-model="studyData.study.summary"
            :rules="rules.summary"
            label="Summary"
            hint="Description of the incident"
            prepend-inner-icon="mdi-text"
            outlined
            required
            auto-grow
          />
        </v-card-text>

        <v-card-title>
          Procedure
        </v-card-title>
        <v-card-subtitle>
          Construct a timeline of the incident, mapped to MITRE ATLAS&trade; techniques. Add at least one step.
          <procedure-legend />
        </v-card-subtitle>
        <v-card-text>
          <edit-procedure
            :key="studyData.study.procedure"
            class="mx-8"
            :procedure="studyData.study.procedure"
            @updateProcedure="studyData.study.procedure = $event"
          />
          <add-procedure-step
            v-if="addingStep"
            ref="addProcStepRef"
            :select-tactic="selectTactic"
            :select-technique="selectTechnique"
            :description="description"
            :adding-step="addingStep"
            @clicked="addProcedureStep"
            @addingBoolUpdate="addingStep = $event"
          />
          <div v-else>
            <v-btn
              class="ma-2 mb-10"
              @click="addingStep = true"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              Add New Step
            </v-btn>
          </div>
        </v-card-text>

        <v-card-title>
          References
        </v-card-title>
        <v-card-subtitle>
          Optionally list sources for this case study.
        </v-card-subtitle>

        <v-card-text>
          <div
            v-if="studyData.study.references"
            class="mx-8"
          >
            <v-list flat>
              <v-list-item-group>
                <div
                  v-for="(value, key) in studyData.study.references"
                  :key="key"
                >
                  <toggleable-source
                    :source="value"
                    :index="key"
                    @clicked="addSourceAt"
                    v-on:delete="deleteSourceAt"
                  />
                </div>
              </v-list-item-group>
            </v-list>
          </div>
          <add-source
            v-if="addingSource"
            ref="addSourceRef"
            :index="studyData.study.references.length"
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

        <v-card-title>
          Download
        </v-card-title>
        <v-card-subtitle>
          Download the case study data file, specifying the filename here. Once downloaded, email the file to <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
        </v-card-subtitle>
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
                  label="Case study filename"
                  hint="Filename of the case study. The .yaml extension will be auto-applied."
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
            </v-col>
            <v-col>
              <download-powerpoint
                ref="formatPpt"
                :study="studyData.study"
                :builder="builder"
                @updateCheckbox="updateCheckbox"
              />
            </v-col>
          </v-row>
          <v-row style="margin-top:-25px">
            <v-col
              cols="3"
            >
              <v-tooltip>
                <template #activator="{ on, attrs }">
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
              </v-tooltip>
            </v-col>
            <v-col>
              <v-alert
                v-if="submissionMsg"
                text
                color="green"
                type="success"
                dense
              >
                {{ submissionMsg }}
                <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
              </v-alert>
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
import { mapActions } from 'vuex'
import { generateID, downloadStudyFile } from '~/assets/tools.js'

export default {
  beforeRouteLeave (to, from, next) {
    if (this.to && this.dialog === false && this.isEditing) {
      next()
    } else {
      next(false)
      this.to = to
      this.dialog = true
    }
  },
  data () {
    return {
      title: 'Create A Case Study',
      valid: true,
      initialFileName: '',

      selectTactic: null,
      selectTechnique: null,
      description: '',

      // Case study data object
      studyData: {
        meta: {},
        study: {
          name: '',
          summary: '',
          'incident-date': null,
          'incident-date-granularity': null,
          procedure: [],
          'reported-by': '',
          references: []
        }
      },

      addingStep: true,
      addingSource: false,

      errorMsg: '',
      submissionMsg: '',
      fileName: '',
      downloadedYaml: true,
      builder: true,
      contactEmail: 'atlas@mitre.org',
      dialog: false,
      to: null,
      isEditing: false,
      pptSelected: '',

      // Initial empty obj bound to field rules prop - must start empty
      rules: {},
      requiredRule: v => !!v || 'Required',
      // rules.key that will get the above rule applied upon click Download
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
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    window.removeEventListener('popstate', this.handleBackButton)
  },
  methods: {
    ...mapActions(['submitCaseStudy']),
    setFileName (loadedFileName) {
      this.fileName = loadedFileName
    },
    setDataFromFile (data) {
      // Directly set proprties on this instance
      this.studyData = data

      // Collapse forms into buttons as needed
      if (this.studyData.study.procedure !== []) {
        this.addingStep = false
      }
      if (this.studyData.study.references !== []) {
        this.addingSource = false
      }
    },
    setIncidentDate (date, granularity) {
      // Called from incident date picker
      this.studyData.study['incident-date'] = date
      this.studyData.study['incident-date-granularity'] = granularity
    },
    updateCheckbox (newval) {
      this.pptSelected = newval
    },
    addProcedureStep (newStep) {
      this.studyData.study.procedure.push(newStep)
      this.addingStep = false
    },
    addSource (newSource) {
      this.studyData.study.references.push(newSource)
      this.addingSource = false
    },
    addSourceAt (newSource, index) {
      this.studyData.study.references.splice(index, 1, newSource)
      this.addingSource = false
    },
    deleteSourceAt (index) {
      this.studyData.study.references.splice(index, 1)
      this.addingSource = false
    },
    submitStudy () {
      this.requiredFieldRuleKeys.forEach((key) => {
        this.rules[key] = [this.requiredRule]
      })

      if (this.$refs.form.validate() && this.studyData.study.procedure.length && this.fileName) {
        this.errorMsg = ''

        // Metadata
        // Initialize meta key if not exists
        this.studyData.meta = this.studyData.meta || {}
        const nowDate = new Date()
        // Only set the date-created once upon study creation
        this.studyData.meta['date-created'] = this.studyData.meta['date-created'] ?? nowDate
        // Always update date-updated
        this.studyData.meta['date-updated'] = nowDate
        this.studyData.meta.uuid = this.studyData.meta.uuid ?? generateID()

        // next 2 lines call actions to create store case study object and download file
        // this.submitCaseStudy(study) // <-- stores case study in store
        downloadStudyFile(this.studyData, this.fileName)

        if (this.pptSelected === true) {
          this.$refs.formatPpt.makePPT(this.fileName)
        }

        // Reset
        this.downloadedYaml = true
        this.submissionMsg = 'Your case study has been downloaded! Email your yaml file to '
      } else if (!this.$refs.form.validate()) {
        this.errorMsg = 'Please complete all required fields'
      } else if (!this.studyData.study.procedure.length) {
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
