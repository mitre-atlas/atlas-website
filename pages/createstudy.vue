<template>
  <div class="mx-8">
    <v-dialog v-model="dialog" max-width="500">
      <navigation-dialog @close="closeDialog" @leave-page="leavePage" />
    </v-dialog>

    <unsaved-changes-dialog
      :show-save-prompt-dialog="showSavePromptDialog"
      @clickReturn="updateSavePromptBool"
      @clickDownload="
        updateSavePromptBool
        cancelOpenInputEditors()
        submitStudy(true)
      "
    />

    <v-row :align="center" no-gutters>
      <page-title>{{ title }}</page-title>
      <v-chip class="mt-10 ml-2" small>
        v{{ $config.study_schema_version }}
      </v-chip>
    </v-row>

    <v-card-actions>
      <v-row class="mb-0">
        <v-col>
          <v-row>
            <upload-file-dialog
              @loaded-data="setDataFromFile"
              @loaded-filename="setFileName"
            />
          </v-row>
        </v-col>
        <v-col>
          <!-- Left align on mobile screens (when buttons are stacked), right align otherwise (when buttons are in the same row) -->
          <v-row justify-xs="start" justify-sm="end">
            <instructions-dialog />
          </v-row>
        </v-col>
      </v-row>
    </v-card-actions>

    <v-form ref="form" v-model="areDetailsValid" lazy-validation>
      <v-card flat>
        <v-card-title>Details</v-card-title>
        <v-card-subtitle>All fields required.</v-card-subtitle>

        <v-card-text>
          <case-study-type
            id="cs-type-card"
            :case-study-type="studyData.study['case-study-type']"
            :study-types="studyTypes"
            :fields="fields"
            :rules="rules['case-study-type']"
            :has-submission-been-attempted="hasSubmissionBeenAttempted"
            @studyTypeUpdate="updateCaseStudyType"
          />

          <v-text-field
            id="titleInput"
            v-model="studyData.study.name"
            :rules="rules.name"
            label="Title"
            :hint="fields.name.description"
            :prepend-inner-icon="fields.name.icon"
            outlined
          />

          <v-text-field
            id="targetInput"
            v-model="studyData.study['target']"
            :rules="rules.target"
            label="Target"
            :hint="fields.target.description"
            :prepend-inner-icon="fields.target.icon"
            outlined
          />

          <v-text-field
            id="actorInput"
            v-model="studyData.study['actor']"
            :rules="rules.actor"
            label="Actor"
            :hint="fields.actor.description"
            :prepend-inner-icon="fields.actor.icon"
            outlined
          />

          <v-text-field
            id="reporterInput"
            ref="reporterInput"
            v-model="studyData.study['reporter']"
            :rules="rules.reporter"
            label="Reporter"
            :hint="fields.reporter.description"
            :prepend-inner-icon="fields.reporter.icon"
            outlined
            :disabled="isReporterDisabled"
          />

          <incident-date-picker
            ref="datePicker"
            :start-date="studyData.study['incident-date']"
            :start-date-granularity="
              studyData.study['incident-date-granularity']
            "
            :initial-rules="rules.incidentDate"
            :initial-errors="errors.incidentDate"
            :submission-status="datePickerSubmissionStatus"
            @isDatePickerOpen="isDatePickerOpen = $event"
            @selectedDate="setIncidentDate"
          />

          <v-textarea
            id="summaryInput"
            v-model="studyData.study.summary"
            :rules="rules.summary"
            label="Summary"
            :hint="fields.summary.description"
            :prepend-inner-icon="fields.summary.icon"
            outlined
            auto-grow
          />
        </v-card-text>

        <v-card-title> Procedure </v-card-title>
        <v-card-subtitle>
          Construct a timeline of the incident, mapped to MITRE ATLAS&trade;
          techniques.
          <span
            :style="!isProcedureValid ? 'color: #FF5252' : ''"
          >Add at least one step.</span>
          <procedure-legend />
        </v-card-subtitle>
        <v-card-text>
          <edit-procedure
            ref="editProcedure"
            :key="studyData.study.procedure"
            class="mx-8"
            :procedure="studyData.study.procedure"
            :enable-status-highlighting="hasSubmissionBeenAttempted"
            @updateProcedure="studyData.study.procedure = $event"
            @areChangesUnsaved="areProcedureChangesUnsaved = $event"
          />
          <add-procedure-step
            v-if="addingStep"
            :id="selection"
            ref="addProcStepRef"
            :select-tactic="selectTactic"
            :select-technique="selectTechnique"
            :description="description"
            :adding-step="addingStep"
            :submission-status="addStepSubmissionStatus"
            @clicked="addProcedureStep"
            @addingBoolUpdate="
              addingStep = $event
              wasAddingStep = false
            "
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

        <v-card-title> References </v-card-title>
        <v-card-subtitle>
          Optionally list sources for this case study.
        </v-card-subtitle>

        <v-card-text>
          <div v-if="studyData.study.references" class="mx-8">
            <v-list flat>
              <v-list-item-group>
                <div
                  v-for="(value, key) in studyData.study.references"
                  :key="key"
                >
                  <toggleable-source
                    ref="toggleableSources"
                    :source="value"
                    :index="key"
                    :enable-status-highlighting="hasSubmissionBeenAttempted"
                    @clicked="addSourceAt"
                    @isEditing="updateReferenceEditingCount"
                    @delete="deleteSourceAt"
                  />
                </div>
              </v-list-item-group>
            </v-list>
          </div>
          <add-source
            v-if="addingSource"
            :id="saveButton"
            ref="addSourceRef"
            :submission-status="addSourceSubmissionStatus"
            :index="studyData.study.references.length"
            @clicked="addSource"
            @addingBoolUpdate="
              addingSource = $event
              wasAddingSource = false
            "
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

        <download-case-study
          ref="downloadCaseStudy"
          :status="status"
          :file-name="fileName"
          :initial-rules="rules.fileName"
          :study-data="studyData"
          :is-form-valid="isFormValid"
          :builder="builder"
          @updateFileName="setFileName"
          @submitForm="submitStudy"
          @makePpt="updateCheckbox"
        />
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
import { downloadStudyFile, setMetaData } from '~/assets/tools.js'
import {
  clearStatus,
  setErrorStatus,
  setWarningStatus,
  setSuccessStatus
} from '~/assets/validation.js'

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
  async asyncData ({ $content }) {
    // Retrieve legend/hints text from YAML file
    const yamlContent = await $content('case-study-legend').fetch()
    return {
      // Store case study field legend info (including hints) from YAML file
      fields: yamlContent.legend,

      // Store case study types from YAML file
      studyTypes: yamlContent.legend.case_study_type.options
    }
  },
  data () {
    return {
      title: 'Create a Case Study',
      areDetailsValid: true,
      // Keep the download button enabled (even if there are errors) until the user actually tries to submit
      hasSubmissionBeenAttempted: false,

      selectTactic: null,
      selectTechnique: null,
      selection: null,
      saveButton: null,
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
          reporter: '',
          actor: '',
          target: '',
          'case-study-type': '',
          references: []
        }
      },

      addingStep: true,
      addingSource: false,

      fileName: '',
      downloadedYaml: true,
      builder: true,
      contactEmail: 'atlas@mitre.org',
      dialog: false,
      to: null,
      isEditing: false,
      pptSelected: '',
      isDatePickerOpen: false,
      referenceEditingCount: 0, // Count of references being edited
      areProcedureChangesUnsaved: false,
      showSavePromptDialog: false,

      wasAddingSource: false,
      wasAddingStep: false,
      wasDatePickerOpen: false,

      status: {
        type: '',
        message: '',
        color: null
      },

      isReporterDisabled: true,
      caseStudyTypeRule: v => !!v,
      reporterRule: (v) => {
        // Reporter is not required only when case study type is exercise OR on page load
        if (
          this.studyData.study['case-study-type'] === 'exercise' ||
          this.studyData.study['case-study-type'] === ''
        ) {
          return true
        }
        return this.requiredRule(v)
      },
      // rules.key that will get the above rule applied upon click Download
      // Fields that should be required
      requiredFieldRuleKeys: [
        'name',
        'target',
        'actor',
        'summary',
        'incidentDate',
        'fileName'
      ],
      // Custom error messages
      errors: {
        incidentDate: []
      },
      selectStudyType: null
    }
  },
  head () {
    return {
      title: `${this.title} | ${this.$config.name.mitre}`
    }
  },
  computed: {
    rules () {
      // Rules for input fields
      const rules = {}
      if (this.hasSubmissionBeenAttempted) {
        this.requiredFieldRuleKeys.forEach((key) => {
          rules[key] = [this.requiredRule]
        })

        rules.incidentDate.push(
          this.isDateValid || 'Entered value not yet saved'
        )
        rules['case-study-type'] = [this.caseStudyTypeRule]
        rules.reporter = [this.reporterRule]
      }
      return rules
    },
    isProcedureValid () {
      return (
        this.studyData.study.procedure.length > 0 ||
        !this.hasSubmissionBeenAttempted
      )
    },
    isDateValid () {
      return (
        !!this.studyData.study['incident-date'] ||
        !this.hasSubmissionBeenAttempted
      )
    },
    isFormValid () {
      const isFilenameInputted = !!this.fileName
      return (
        (isFilenameInputted && this.areDetailsValid && this.isProcedureValid) ||
        !this.hasSubmissionBeenAttempted
      )
    },
    areReferenceChangesUnsaved () {
      return this.referenceEditingCount > 0
    },
    areChangesUnsaved () {
      return (
        this.addingSource ||
        this.addingStep ||
        this.areProcedureChangesUnsaved ||
        this.areReferenceChangesUnsaved ||
        this.isDatePickerOpen
      )
    },
    // If the procedure is invalid, error
    // If a step is currently being added (unsaved), warn
    addStepSubmissionStatus () {
      if (!this.isProcedureValid) {
        return { type: 'error', message: 'At least one step is required' }
        // this.hasSubmissionBeenAttempted ensures no warning until submission attempted
      } else if (this.wasAddingStep && this.hasSubmissionBeenAttempted) {
        return { type: 'warning', message: 'Unsaved changes' }
      }
      return {}
    },
    // If a source is currently being added (unsaved), and the user has attempted to submit, warn
    addSourceSubmissionStatus () {
      if (this.wasAddingSource && this.hasSubmissionBeenAttempted) {
        return { type: 'warning', message: 'Unsaved changes' }
      }
      return {}
    },

    datePickerSubmissionStatus () {
      if (this.hasSubmissionBeenAttempted) {
        if (this.wasDatePickerOpen) {
          return { type: 'warning', message: 'Unsaved changes' }
        } else if (!this.isDateValid) {
          return { type: 'error', message: 'Date not selected' }
        }
      }
      return {}
    }
  },
  watch: {
    areChangesUnsaved (newVal, oldVal) {
      if (this.hasSubmissionBeenAttempted && !newVal && oldVal) {
        // User resolved unsaved changes after download attempt
        this.status = clearStatus(this.status)
        // Reset submission attempt to restart validation logic as if this were a newly filled form
        // this.hasSubmissionBeenAttempted = false
      }
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
    // Keeps track of the count of references currently being edited in order as a condition for the
    // unsaved warning modal
    updateReferenceEditingCount (sourceEditingState) {
      if (sourceEditingState) {
        this.referenceEditingCount += 1
      } else {
        this.referenceEditingCount -= 1
      }
    },
    requiredRule (value) {
      const emptyRule = value => !!value || 'Required'
      const whitespaceRule = value =>
        (!!value && !!value.trim()) || 'Field cannot be empty'

      const passValues = [emptyRule(value), whitespaceRule(value)]

      for (let i = 0; i < passValues.length; i++) {
        const passValue = passValues[i]

        // String value == error message
        if (typeof passValue === 'string') {
          if (this.status.message) {
            this.status = setErrorStatus(this.status)
          }
          return passValue
        }
      }
      this.status = clearStatus(this.status)
      return true
    },
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

      // Reset success and/or error messages
      this.status = clearStatus(this.status)
      // Clears validation for when file is uploaded, so validation doesn't show up upon file upload.
      this.$refs.form.resetValidation()
      this.errors = {
        incidentDate: []
      }
      if (this.studyData.study['case-study-type'] === 'incident') {
        this.isReporterDisabled = false
      } else {
        this.isReporterDisabled = true
        this.studyData.study.reporter = ''
      }
    },
    setIncidentDate (date, granularity) {
      // Called from incident date picker
      this.wasDatePickerOpen = false
      this.studyData.study['incident-date'] = date
      this.studyData.study['incident-date-granularity'] = granularity
    },
    updateCheckbox (newval) {
      this.pptSelected = newval
    },
    updateSavePromptBool (newVal) {
      this.showSavePromptDialog = newVal
    },
    updateCaseStudyType (newType) {
      this.studyData.study['case-study-type'] = newType
      if (this.studyData.study['case-study-type'] !== 'exercise') {
        this.isReporterDisabled = false
      } else {
        // Reset so that reporter field are not required
        this.isReporterDisabled = true
        this.studyData.study.reporter = ''
        this.$refs.reporterInput.validate(true)
      }
      if (this.hasSubmissionBeenAttempted) {
        this.$refs.reporterInput.validate(true)
      }
    },
    addProcedureStep (newStep) {
      this.studyData.study.procedure.push(newStep)
      this.addingStep = false
      this.wasAddingStep = false
    },
    addSource (newSource) {
      this.studyData.study.references.push(newSource)
      this.addingSource = false
      this.wasAddingSource = false
    },
    addSourceAt (newSource, index) {
      this.studyData.study.references.splice(index, 1, newSource)
    },
    deleteSourceAt (index) {
      this.studyData.study.references.splice(index, 1)
    },
    async submitStudy (ignoreUnsavedChanges = false) {
      // Disable the download button until all input errors resolved
      this.hasSubmissionBeenAttempted = true
      // Form validation section
      // Validate the form for required fields, which will update the bound variable "valid"
      this.$refs.form.validate()

      // Wait until the DOM updates for validation to take place
      await this.$nextTick()

      // End form validation section

      // Successful form fill
      // this.isFormValid covers all input fields, including date picker
      if (this.isFormValid) {
        this.status = clearStatus(this.status)
        // If there are unsaved changes and we are not ignoring them, stop the download process
        if (this.areChangesUnsaved && !ignoreUnsavedChanges) {
          this.status = setWarningStatus(
            this.status,
            'You have unsaved changes'
          )
          this.flagOpenInputEditors()
          this.showSavePromptDialog = true
          return
        }

        // Metadata
        this.studyData.meta = setMetaData(
          this.studyData,
          this.$config.study_schema_version
        )

        // next 2 lines call actions to create store case study object and download file
        // this.submitCaseStudy(study) // <-- stores case study in store
        downloadStudyFile(this.studyData, this.fileName)

        if (this.pptSelected === true) {
          // this.$refs.formatPpt.makePPT(this.fileName)
          this.$refs.downloadCaseStudy.$refs.formatPpt.makePPT(this.fileName)
        }

        // Reset
        this.downloadedYaml = true
        // Reset any error or warning states
        this.hasSubmissionBeenAttempted = false
        this.status = setSuccessStatus(
          this.status,
          this.hasSubmissionBeenAttempted,
          'Your case study has been downloaded! Email your yaml file to ' +
            this.contactEmail
        )[0]
        this.hasSubmissionBeenAttempted = setSuccessStatus(
          this.status,
          this.hasSubmissionBeenAttempted,
          'Your case study has been downloaded! Email your yaml file to ' +
            this.contactEmail
        )[1]
      } else {
        // Form has validation errors, display message to have users scroll up
        this.status = setErrorStatus(this.status)
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
    },
    flagOpenInputEditors () {
      // Instantaneously checks if there are any open editors, and marks their flags accordingly
      if (this.isDatePickerOpen) {
        this.wasDatePickerOpen = true
      }
      if (this.areProcedureChangesUnsaved) {
        this.$refs.editProcedure.$refs.editProcedureCards.forEach((card) => {
          if (card.editingData) {
            card.wasEditing = true
          }
        })
      }
      if (this.addingStep) {
        this.wasAddingStep = true
      }
      if (this.areReferenceChangesUnsaved) {
        this.$refs.toggleableSources.forEach((ts) => {
          if (ts.isInEditMode) {
            ts.wasInEditMode = true
          }
        })
      }
      if (this.addingSource) {
        this.wasAddingSource = true
      }
    },
    cancelOpenInputEditors () {
      // Cancel date picker input if open
      if (this.isDatePickerOpen) {
        this.$refs.datePicker.cancel()
      }
      // Cancel any procedure step cards in edit mode
      if (this.areProcedureChangesUnsaved) {
        // Call cancel edit on nested edit procedure cards
        this.$refs.editProcedure.$refs.editProcedureCards.forEach((card) => {
          if (card.isEditing) {
            card.cancelEdit()
          }
        })
      }
      // Close any add procedure steps
      if (this.addingStep) {
        this.addingStep = false
      }

      // Handle open source editors
      if (this.areReferenceChangesUnsaved) {
        this.$refs.toggleableSources.forEach((ts) => {
          if (ts.isInEditMode) {
            // Call event handler that eventually is hit by EditSourceListItem
            ts.updateEditingState(false)
          }
        })
      }

      // Close any add source cards
      if (this.addingSource) {
        this.addingSource = false
      }
    }
  }
}
</script>
