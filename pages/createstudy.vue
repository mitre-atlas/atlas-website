<template>
  <div>
    <v-dialog v-model="dialog" max-width="500">
      <navigation-dialog @close="closeDialog" @leave-page="leavePage" />
    </v-dialog>

    <unsaved-changes-dialog
      :show-save-prompt-dialog="showSavePromptDialog"
      @clickFromUnsaved="unsavedButton"
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
            v-model="isDatePickerOpen"
            :start-date="studyData.study['incident-date']"
            :start-date-granularity="
              studyData.study['incident-date-granularity']
            "
            :initial-rules="rules.incidentDate"
            :initial-errors="errors.incidentDate"
            :submission-status="datePickerSubmissionStatus"
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
            v-model="studyData.study.procedure"
            class="mx-8"
            :enable-status-highlighting="hasSubmissionBeenAttempted"
            @areChangesUnsaved="areProcedureChangesUnsaved = $event"
          />
          <add-procedure-step
            v-if="addingStep"
            :id="selection"
            ref="addProcStepRef"
            v-model="procedureStep"
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
import { downloadStudyFile, setMetaData } from '~/assets/tools.js'
import {
  clearStatus,
  setErrorStatus,
  setWarningStatus,
  setSuccessStatus
} from '~/assets/validation.js'
// Case Study Builder
export default {
  /**
   * beforeRouteLeave is used to guard navigations either by redirecting it or canceling it.
   * All changes will be lost if user chooses to navigate away
   *
   * @param {any} to: Route: the target Route Object being navigated to.
   * @param {any} from: Route: the current route being navigated away from.
   * @param {any} next: Function: this function must be called to resolve the hook. The action depends on the arguments provided to next
   */
  beforeRouteLeave (to, from, next) {
    if (this.to && this.dialog === false && this.isEditing) {
      next()
    } else {
      next(false)
      this.to = to
      this.dialog = true
    }
  },
  /**
   * asyncData method returns data from case-study-legend.yaml (icon, name, description)
   */
  async asyncData ({ $content }) {
    // Retrieve legend/hints text from YAML file
    const yamlContent = await $content('case-study-legend').fetch()
    return {
      // Store case study field legend info (including hints) from YAML file
      fields: yamlContent.legend
    }
  },
  data () {
    return {
      /**
       * Static title
       * @type {String}
       */
      title: 'Create a Case Study',
      /**
       * Form valid check
       * @type {Boolean}
       */
      areDetailsValid: true,
      // Keep the download button enabled (even if there are errors) until the user actually tries to submit
      hasSubmissionBeenAttempted: false,

      /**
       * Set empty procedure step object
       * @type {Object}
       */
      procedureStep: {
        tactic: null,
        technique: null,
        description: ''
      },

      selection: null,

      /**
       * Source id for case study reference sources
       * @type {String}
       */
      saveButton: null,

      /**
       * Case study data object
       * @type {Object}
       */
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

      // Adding procedure step
      addingStep: true,
      // Adding reference source
      addingSource: false,

      /**
       * Download case study file
       */
      // Download file name
      fileName: '',
      // Download case study button boolean
      downloadedYaml: true,
      contactEmail: 'atlas@mitre.org',
      // Navigation dialog shown before route navigation away from case study
      dialog: false,
      // Route
      to: null,
      // Check if form has started to be filled out
      isEditing: false,
      // Check if powerpoint checked
      pptSelected: '',
      // To prevent download of case study due to date picker unsaved changes
      isDatePickerOpen: false,
      // Count of references being edited
      referenceEditingCount: 0,
      // To prevent download of case study due to procedure unsaved changes
      areProcedureChangesUnsaved: false,
      // Save prompt dialog
      showSavePromptDialog: false,

      // Flag open input editors
      wasAddingSource: false,
      wasAddingStep: false,
      wasDatePickerOpen: false,

      // Download case study status
      status: {
        type: '',
        message: '',
        color: null
      },

      // Reporter input field status
      isReporterDisabled: true,
      // Rules for case study type radio selections
      caseStudyTypeRule: v => !!v,
      // Reporter feild rules based on case study type
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
  /**
   * Head method updates <page-title>
   */
  head () {
    return {
      title: `${this.title} | ${this.$config.name.mitre}`
    }
  },
  computed: {
    /**
     * Rules for input fields
     * @type {Object}
     */
    rules () {
      const rules = {}
      // Rules will be applied on downloaded submissions
      if (this.hasSubmissionBeenAttempted) {
        this.requiredFieldRuleKeys.forEach((key) => {
          rules[key] = [this.requiredRule]
        })
        // Check valid date input
        rules.incidentDate.push(
          this.isDateValid || 'Entered value not yet saved'
        )
        rules['case-study-type'] = [this.caseStudyTypeRule]
        rules.reporter = [this.reporterRule]
      }
      return rules
    },
    /**
     * Returns true if there's procedure object saved in studyData
     * or download submission attempt is false
     */
    isProcedureValid () {
      return (
        this.studyData.study.procedure.length > 0 ||
        !this.hasSubmissionBeenAttempted
      )
    },
    /**
     * Returns true if there's incident-date value in studyData
     * or download submission attempt is false
     */
    isDateValid () {
      return (
        !!this.studyData.study['incident-date'] ||
        !this.hasSubmissionBeenAttempted
      )
    },
    /**
     * Form check file name input, form inputs, etc.
     */
    isFormValid () {
      const isFilenameInputted = !!this.fileName
      return (
        (isFilenameInputted && this.areDetailsValid && this.isProcedureValid) ||
        !this.hasSubmissionBeenAttempted
      )
    },
    /**
     * Checks if any references are being edited
     */
    areReferenceChangesUnsaved () {
      return this.referenceEditingCount > 0
    },
    /**
     * Checking any hanging open input field editors
     */
    areChangesUnsaved () {
      return (
        this.addingSource ||
        this.addingStep ||
        this.areProcedureChangesUnsaved ||
        this.areReferenceChangesUnsaved ||
        this.isDatePickerOpen
      )
    },
    /**
     * If the procedure is invalid, return error msg
     * If a step is currently being added (unsaved), return warning
     */
    addStepSubmissionStatus () {
      if (!this.isProcedureValid) {
        return { type: 'error', message: 'At least one step is required' }
        // this.hasSubmissionBeenAttempted ensures no warning until submission attempted
      } else if (this.wasAddingStep && this.hasSubmissionBeenAttempted) {
        return { type: 'warning', message: 'Unsaved changes' }
      }
      return {}
    },
    /**
     * If a source is currently being added (unsaved), and the user has attempted to submit
     * return warning
     */
    addSourceSubmissionStatus () {
      if (this.wasAddingSource && this.hasSubmissionBeenAttempted) {
        return { type: 'warning', message: 'Unsaved changes' }
      }
      return {}
    },
    /**
     * If date picker is currently being edited, and user has attempted to submit
     * return warning
     * If date is invalid, and user has attempted to submit
     * return error msg
     */
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
    /**
     * Track for unsaved changes input fields and user fixes
     * @param {Boolean} newVal
     * @param {Boolean} oldVal
     */
    areChangesUnsaved (newVal, oldVal) {
      if (this.hasSubmissionBeenAttempted && !newVal && oldVal) {
        // User resolved unsaved changes after download attempt
        this.status = clearStatus(this.status)
        // Reset submission attempt to restart validation logic as if this were a newly filled form
        // this.hasSubmissionBeenAttempted = false
      }
    }
  },
  /**
   * Mount vue instances for route navigation changes
   */
  beforeMount () {
    window.addEventListener('beforeunload', this.handleBeforeUnload)
    window.addEventListener('popstate', this.handleBackButton)
  },
  /**
   * Remove vue instances for route navigation changes
   */
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    window.removeEventListener('popstate', this.handleBackButton)
  },
  methods: {
    /**
     * Keeps track of the count of references currently being edited in order as a condition for the
     * unsaved warning modal
     * @param {Boolean} sourceEditingState True if toggeable sources isEditing(true)
     */
    updateReferenceEditingCount (sourceEditingState) {
      if (sourceEditingState) {
        this.referenceEditingCount += 1
      } else {
        this.referenceEditingCount -= 1
      }
    },
    /**
     * Required rules include whitespace trim and empty inputs.
     * @param {String} value input field value
     */
    requiredRule (value) {
      // If there's no value then set message
      const emptyRule = value => !!value || 'Required'
      const whitespaceRule = value =>
        (!!value && !!value.trim()) || 'Field cannot be empty'

      const passValues = [emptyRule(value), whitespaceRule(value)]
      // Loop passValues to set error status
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
    /**
     * File name from uploaded file
     * @param {String} loadedFileName
     */
    setFileName (loadedFileName) {
      this.fileName = loadedFileName
    },
    /**
     * Set studyData with uploaded case study data
     * @param {Object} data case study data
     */
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
    /**
     * Set date from date picker
     * @param {Date} date
     * @param {String} granularity
     */
    setIncidentDate (date, granularity) {
      // Called from incident date picker
      this.wasDatePickerOpen = false
      this.studyData.study['incident-date'] = date
      this.studyData.study['incident-date-granularity'] = granularity
    },
    /**
     * Check selection of downloaded ppt checkbox
     * @param {Boolean} newval
     */
    updateCheckbox (newval) {
      this.pptSelected = newval
    },
    /**
     * Dialog flag for opened input editors with unsaved changes
     * @param {String} newVal continue or return
     */
    unsavedButton (newVal) {
      this.showSavePromptDialog = false
      if (newVal === 'continue') {
        this.cancelOpenInputEditors()
        this.submitStudy(true)
      }
    },
    /**
     * Case study type method
     * @param {String} newType Exercise or Incident
     */
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
    /**
     * Add case study procedure step input
     * @param {Object} newStep Passes description, tactic, and technique
     */
    addProcedureStep (newStep) {
      this.studyData.study.procedure.push(newStep)
      this.addingStep = false
      this.wasAddingStep = false
      // Reset new procedure step to empty
      this.procedureStep = {
        tactic: null,
        technique: null,
        description: ''
      }
    },
    /**
     * Add reference source input
     * @param {Object} newSource Passes title and url
     */
    addSource (newSource) {
      this.studyData.study.references.push(newSource)
      this.addingSource = false
      this.wasAddingSource = false
    },
    /**
     * Saving edited reference source changes
     * @param {Object} newSource Passes title and url
     * @param {int} index Source number
     */
    addSourceAt (newSource, index) {
      this.studyData.study.references.splice(index, 1, newSource)
    },
    /**
     * Delete reference source
     * @param {int} index Source number
     */
    deleteSourceAt (index) {
      this.studyData.study.references.splice(index, 1)
    },
    /**
     * Download case study
     */
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
    /**
     * Set navigation dialog to dismiss dialog and not navigate away
     */
    closeDialog () {
      this.dialog = false
      this.isEditing = true
      this.to = null
    },
    /**
     * Continue navigating away from case study page
     */
    leavePage () {
      this.dialog = false
      this.isEditing = true
      this.$router.push(this.to)
    },
    /**
     * Handle navigation route with the back button
     */
    handleBackButton () {
      this.dialog = true
    },
    /**
     * Event handler for beforeMount and beforeDestroy route navigation
     */
    handleBeforeUnload (event) {
      if (!this.isEditing) {
        return
      }
      event.preventDefault()
      event.returnValue = ''
    },
    /**
     * Checking unsaved open input editors when case study download is clicked
     */
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
    /**
     * Flag when unsaved changes dialog 'continue' is selected
     * Continue to download
     */
    cancelOpenInputEditors () {
      // Cancel date picker input if open
      if (this.isDatePickerOpen) {
        this.$refs.datePicker.cancel()
      }
      // Cancel any procedure step cards in edit mode
      if (this.areProcedureChangesUnsaved) {
        // Call cancel edit on nested edit procedure cards
        this.$refs.editProcedure.$refs.editProcedureCards.forEach((card) => {
          if (card.editingData) {
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
