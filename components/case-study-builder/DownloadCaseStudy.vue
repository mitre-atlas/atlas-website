<template>
  <div>
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
              v-model="setFileName"
              :rules="rules"
              label="Case study filename"
              hint="Filename of the case study. The .yaml extension will be auto-applied."
              prepend-inner-icon="mdi-file-download"
              outlined
              clearable
              auto-grow
              @input="$emit('updateFileName', setFileName)"
            />
          </div>
        </v-col>
        <v-col>
          <download-powerpoint
            ref="formatPpt"
            :study="caseStudyData.study"
            :builder="true"
            @updateCheckbox="updateCheckbox"
          />
        </v-col>
      </v-row>
      <v-row style="margin-top: -25px">
        <v-col cols="auto">
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
            @click="$emit('submitForm')"
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
              v-if="!!errorStatus.message"
              class="mb-0"
              :color="errorStatus.color"
              :type="errorStatus.type"
              text
              dense
            >
              <span v-linkified v-html="errorStatus.message" />
            </v-alert>
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
/**
 * Download section of case study builder with button, filename input,
 * status and post-download options
 */
export default {
  name: 'DownloadCaseStudy',
  props: [
    /**
     * Error status object
     * ```
     * {
     *    type: str,
     *    color: str,
     *    message: str
     * }
     * ```
     * @type {Object}
     */
    'status',
    /**
     * Inputted filename for the downloaded YAML file
     * @type {String}
     */
    'fileName',
    /**
     * Validation rules for the filename text input
     * @type {function[]}
     */
    'initialRules',
    /**
     * Case study data object from the builder
     * @type {Object}
     */
    'studyData',
    /**
     * Whether the main builder form is valid
     * @type {Boolean}
     */
    'isFormValid'
  ],
  data () {
    return {
      /**
       * Error status object
       * ```
       * {
       *    type: str,
       *    color: str,
       *    message: str
       * }
       * ```
       * @type {Object}
       */
      errorStatus: this.status,
      /**
       * Inputted filename for the downloaded YAML file
       * @type {String}
       */
      setFileName: this.fileName,
      /**
       * Validation rules for the filename text input
       * @type {function[]}
       */
      rules: this.initialRules,
      /**
       * Case study data object from the builder
       * @type {Object}
       */
      caseStudyData: this.studyData,
      /**
       * Whether to additionally download a PowerPoint
       */
      makePpt: false
    }
  },
  watch: {
    fileName: {
      immediate: true,
      handler (newVal, oldVal) {
        this.setFileName = newVal
      }
    },
    initialRules: {
      // Ensures that the component data is up to date with rules update
      // during form submit
      immediate: true,
      handler (newVal, oldVal) {
        this.rules = newVal
      }
    }
  },
  methods: {
    // Sets and emits makePpt
    updateCheckbox (newVal) {
      this.makePpt = newVal
      /**
       * Bubbles up the makePpt event from the DownloadPowerpoint component
       */
      this.$emit('makePpt', this.makePpt)
    }
  }
}
</script>
