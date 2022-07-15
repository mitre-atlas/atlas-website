<template>
  <div class="mx-8">
    <v-dialog v-model="dialog" width="500">
      <navigation-dialog @close="closeDialog" @leave-page="leavePage" />
    </v-dialog>
    <v-dialog v-model="showSavePromptDialog" width="500">
      <v-card>
        <v-card-title> Unsaved changes </v-card-title>

        <v-card-text>
          <div class="content">
            You have unsaved changes.
            <v-spacer />
            Continue submission without including changes?
          </div>
          <slot />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="ma-1"
            color="grey"
            text
            @click="showSavePromptDialog = false"
          >
            Return
          </v-btn>
          <v-btn
            class="ma-1"
            color="warning"
            text
            @click="
              showSavePromptDialog = false
              cancelOpenInputEditors()
              submitStudy(true)
            "
          >
            Continue to download
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <page-title>{{ title }}</page-title>

    <v-card-actions>
      <upload-file-dialog
        @loaded-data="setDataFromFile"
        @loaded-filename="setFileName"
      />
      <v-spacer />
      <instructions-dialog />
    </v-card-actions>

    <v-form ref="form" v-model="areDetailsValid" lazy-validation>
      <v-card flat>
        <v-card-title>Details</v-card-title>
        <v-card-subtitle>All fields required.</v-card-subtitle>

        <v-card-text>
          <v-text-field
            id="titleInput"
            v-model="studyData.study.name"
            :rules="rules.title"
            label="Title"
            hint="Name for this case study"
            prepend-inner-icon="mdi-format-title"
            outlined
            required
          />

          <v-text-field
            id="reporterInput"
            v-model="studyData.study['reported-by']"
            :rules="rules.reportedBy"
            label="Reported by"
            hint="Name(s) of the original authors of the study"
            prepend-inner-icon="mdi-account"
            outlined
            required
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
            hint="Description of the incident"
            prepend-inner-icon="mdi-text"
            outlined
            required
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

        <v-card-title> Download </v-card-title>
        <v-card-subtitle>
          Download the case study data file, specifying the filename here. Once
          downloaded, email the file to
          <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="3" md="6">
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
          <v-row style="margin-top: -25px">
            <v-col cols="4">
              <!-- <v-tooltip> -->
              <!-- <template #activator="{ on, attrs }"> -->
              <v-btn
                id="download_case_study_button"
                color="primary"
                :disabled="!isFormValid"
                v-bind="attrs"
                class="mb-2"
                block
                v-on="on"
                @click="submitStudy()"
              >
                <v-icon left>
                  mdi-download
                </v-icon>
                Download Case Study
              </v-btn>
              <!-- </template> -->
              <!-- </v-tooltip> -->
            </v-col>
            <v-col>
              <v-fade-transition>
                <v-alert
                  v-if="!!status.message"
                  class="mb-0"
                  :color="status.color"
                  :type="status.type"
                  text
                  dense
                >
                  <span v-linkified v-html="status.message" />
                </v-alert>
              </v-fade-transition>
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
      areDetailsValid: true,
      // Keep the download button enabled (even if there are errors) until the user actually tries to submit
      hasSubmissionBeenAttempted: false,
      initialFileName: '',

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
      isDatePickerOpen: false,
      referenceEditingCount: 0, // Count of references being edited
      areProcedureChangesUnsaved: false,
      showSavePromptDialog: false,

      status: {
        message: '',
        color: null
      },

      // Fields that should be required
      requiredFieldRuleKeys: [
        'title',
        'reportedBy',
        'summary',
        'incidentDate',
        'fileName'
      ],
      // Custom error messages
      errors: {
        incidentDate: []
      }
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
      this.requiredFieldRuleKeys.forEach((key) => {
        rules[key] = [this.requiredRule]
      })
      return rules
    },
    isProcedureValid () {
      return (
        this.studyData.study.procedure.length > 0 ||
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
    hasDownloadIssue () {
      // After download, and check existence of a non-status message with a populated message,
      // as the message field is reset to empty upon valid conditions in clearStatus()
      return this.hasSubmissionBeenAttempted && (this.status.message.type !== 'success' && this.status.message !== '')
    },
    // If the procedure is invalid, error
    // If a step is currently being added (unsaved), warn
    addStepSubmissionStatus () {
      if (!this.isProcedureValid) {
        return { type: 'error', message: 'At least one step is required' }
        // this.hasSubmissionBeenAttempted ensures no warning until submission attempted
      } else if (this.addingStep && this.hasDownloadIssue) {
        return { type: 'warning', message: 'Unsaved changes' }
      }
      return {}
    },
    // If a source is currently being added (unsaved), and the user has attempted to submit, warn
    addSourceSubmissionStatus () {
      if (this.addingSource && this.hasDownloadIssue) {
        return { type: 'warning', message: 'Unsaved changes' }
      }
      return {}
    },

    datePickerSubmissionStatus () {
      if (this.isDatePickerOpen && this.hasDownloadIssue) {
        return { type: 'warning', message: 'Unsaved changes' }
      }
      return {}
    }
  },
  watch: {
    areChangesUnsaved (newVal, oldVal) {
      if (this.hasSubmissionBeenAttempted && !newVal && oldVal) {
        // User resolved unsaved changes after download attempt
        this.clearStatus()
        // Reset submission attempt to restart validation logic as if this were a newly filled form
        this.hasSubmissionBeenAttempted = false
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
    // Sets messages for the alert component
    setErrorStatus (message = 'Please address any errors above') {
      this.status.type = 'error'
      this.status.color = 'error'
      this.status.message = message
    },
    setWarningStatus (message) {
      this.status.type = 'warning'
      this.status.color = 'warning'
      this.status.message = message
    },
    setSuccessStatus (message) {
      this.status.type = 'success'
      this.status.color = 'success'
      this.status.message = message

      setTimeout(() => {
        // Reset status
        this.status.type = ''
        this.status.color = null
        this.status.message = ''
        // Reset download status
        this.hasSubmissionBeenAttempted = false
      }, 3000)
    },
    clearStatus () {
      this.status.message = ''
    },
    // Checks if the value exists, and if it is more than whitespace
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
            this.setErrorStatus()
          }
          return passValue
        }
      }
      this.clearStatus()
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

      // Reset sucess and/or error messages
      this.clearStatus()
      this.errors = {
        incidentDate: []
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
        this.clearStatus()
        // If there are unsaved changes and we are not ignoring them, stop the download process
        if (this.areChangesUnsaved && !ignoreUnsavedChanges) {
          this.setWarningStatus('You have unsaved changes')
          this.showSavePromptDialog = true
          return
        }

        // Metadata
        // Initialize meta key if not exists
        this.studyData.meta = this.studyData.meta || {}
        const nowDate = new Date()
        // Only set the date-created once upon study creation
        this.studyData.meta['date-created'] =
          this.studyData.meta['date-created'] ?? nowDate
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
        // Reset any error or warning states
        this.hasSubmissionBeenAttempted = false
        this.setSuccessStatus(
          'Your case study has been downloaded! Email your yaml file to ' +
            this.contactEmail
        )
      } else {
        // Form has validation errors, display message to have users scroll up
        this.setErrorStatus()
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
    cancelOpenInputEditors () {
      // Cancel date picker input if open
      if (this.isDatePickerOpen) {
        this.$refs.datePicker.cancel()
      }
      // Cancel any procedure step cards in edit mode
      if (this.areProcedureChangesUnsaved) {
        // Call cancel edit on nested edit procedure cards
        this.$refs.editProcedure.$refs.editProcedureCards.forEach((card) => {
          if (card.editing) {
            card.cancelEdit()
          }
        })
      }
      // Close any add procedure steps
      if (this.addingStep) {
        this.addingStep = false
      }

      // Handle open source editors
      if (this.referenceEditingCount > 0) {
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
