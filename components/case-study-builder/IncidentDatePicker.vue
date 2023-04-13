<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :close-on-click="false"
      transition="scale-transition"
      top
      content-class="elevation-0"
      offset-y
      min-width="auto"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="displayedIncidentDate"
          label="Incident date"
          hint="Only the year is required, but please specify month and day where possible"
          prepend-inner-icon="mdi-calendar"
          outlined
          readonly
          v-bind="attrs"
          :rules="rules"
          :error-messages="errors"
          v-on="on"
          @click="cancel"
        />
      </template>

      <v-card :style="cardStyle" outlined class="mb-3">
        <v-date-picker
          v-model="dateISOString"
          no-title
          :active-picker.sync="activePicker"
          :max="
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .substr(0, 10)
          "
          min="1970-01-01"
          @click:year="yearSelected"
          @click:month="monthSelected"
          @click:date="dateSelected"
        >
          <v-card-subtitle v-if="hasStatus" class="py-2" :style="headerStyle">
            {{ submissionStatus.message }}
          </v-card-subtitle>
          <v-spacer />
          <v-btn text color="secondary" @click="cancel">
            Cancel
          </v-btn>
          <v-btn text color="primary" @click="ok">
            Save
          </v-btn>
        </v-date-picker>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { statusStyleHeader, statusStyleCard } from '~/assets/validation.js'
/**
 * Clickable popup incident date input - starts with year, then optionally month,
 * then optionally day
 */
export default {
  name: 'IncidentDatePicker',
  props: [
    'value',
    /**
     * Starting incident date
     * @type {Date}
     */
    'startDate',
    /**
     * Granularity of the starting incident date,
     * one of `YEAR`, `MONTH`, or `DATE`
     * @type {String}
     */
    'startDateGranularity',
    /**
     * Validation rules for incident date
     * @type {function[]}
     */
    'initialRules',
    /**
     * Custom error messages for incident date
     * @type {String[]}
     */
    'initialErrors',
    /**
     * Submission status object with
     * ```
     * {
     *    type: str,
     *    color: str,
     *    message: str
     * }
     * ```
     * @type {Object}
     */
    'submissionStatus'
  ],
  data () {
    return {
      /**
       * Date granularity for Vuetify date picker use
       * @type {String}
       */
      activePicker: null,
      /**
       * Controls whether the picker popup is open
       */
      menu: false,
      /**
       * Selected incident date
       * @type {Date}
       */
      date: this.startDate,
      /**
       * Granularity of the incident date,
       * one of `YEAR`, `MONTH`, or `DATE`
       * @type {String}
       */
      dateGranularity: this.startDateGranularity,
      /**
       * Validation rules for incident date
       * @type {function[]}
       */
      rules: this.initialRules,
      /**
       * Custom error messages for incident date
       * @type {String[]}
       */
      errors: this.initialErrors
    }
  },
  computed: {
    /**
     * Returns true if the submission status has a type
     * @returns {Boolean}
     */
    hasStatus () {
      return !!(this.submissionStatus ?? {}).type
    },
    /**
     * Sets card title font color according to submission state
     */
    headerStyle () {
      return statusStyleHeader(this.submissionStatus)
    },
    /**
     * Sets card outline border color according to submission state
     */
    cardStyle () {
      return statusStyleCard(this.submissionStatus)
    },
    /**
     * The currently selected date in YYYY-MM-DD format
     * @type {String}
     */
    dateISOString () {
      // Set the date-picker date
      if (this.date != null) {
        return this.date.toISOString().substr(0, 10)
      }
      return null
    },
    /**
     * Long-form representation of the selected date in the specified granularity,
     * i.e. January 1, 2020, or January 2020, or 2020
     * @type {String}
     */
    displayedIncidentDate () {
      if (this.date != null) {
        if (this.dateGranularity === 'YEAR') {
          return this.date.toLocaleDateString('default', {
            timeZone: 'UTC',
            year: 'numeric'
          })
        } else if (this.dateGranularity === 'MONTH') {
          return this.date.toLocaleDateString('default', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'long'
          })
        } else if (
          this.dateGranularity == null ||
          this.dateGranularity === 'DATE'
        ) {
          // If dateGranularity is DATE, or there is no date granularity
          return this.date.toLocaleDateString('default', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }
      }
      return null
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
      /**
       * Whether the date picker popup is open
       * @arg {Boolean} val
       */
      this.$emit('input', val)
    },
    startDate: {
      // Ensures that the component data is up to date with prop change
      // during file load
      immediate: true,
      handler (newVal, oldVal) {
        this.date = newVal
      }
    },
    startDateGranularity: {
      // Ensures that the component data is up to date with prop change
      // during file load
      immediate: true,
      handler (newVal, oldVal) {
        this.dateGranularity = newVal
      }
    },
    initialRules: {
      // Ensures that the component data is up to date with rules update
      // during form submit
      immediate: true,
      handler (newVal, oldVal) {
        this.rules = newVal
      }
    },
    initialErrors: {
      // Ensures that the component data is up to date with errors update from createstudy
      // during form submit
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.errors = newVal
      }
    }
  },
  methods: {
    /**
     * Sets the date and granularity when a year is selected
     * @param {String} year - `YYYY`
     */
    yearSelected (year) {
      // Parameter is YYYY int
      this.dateGranularity = 'YEAR'
      // Create Date in UTC
      this.date = new Date(Date.UTC(year))
      // Construct display date
      this.displayedIncidentDate = this.date.getUTCFullYear()
    },
    /**
     * Sets the date and granularity when a month is selected
     * @param {String} yearMonth - `YYYY-MM`
     */
    monthSelected (yearMonth) {
      // Parameter is YYYY-MM string
      this.dateGranularity = 'MONTH'
      // Split into string tokens
      const [yearStr, monthStr] = yearMonth.split('-')
      // Parse tokens into ints
      const year = parseInt(yearStr)
      const monthIndex = parseInt(monthStr) - 1
      // Create Date in UTC
      this.date = new Date(Date.UTC(year, monthIndex))
    },
    /**
     * Sets the date and granularity when a day is selected
     * @param {String} yearMonthDate - `YYYY-MM-DD`
     */
    dateSelected (yearMonthDate) {
      // Parameter is YYYY-MM-DD string
      this.dateGranularity = 'DATE'
      // Split into string tokens
      const [yearStr, monthStr, dateStr] = yearMonthDate.split('-')
      // Parse tokens into ints
      const year = parseInt(yearStr)
      const monthIndex = parseInt(monthStr) - 1
      const day = parseInt(dateStr)
      // Create Date in UTC
      this.date = new Date(Date.UTC(year, monthIndex, day))
    },
    // Emits the selected date, closes the dialog and resets any error messages
    ok () {
      // Close menu
      this.menu = false

      // Reset any error messages
      this.errors = []

      /**
       * Emit date pieces (1-indexed month) and date granularity
       * @arg {Date} date
       * @arg {String} dateGranularity
       */
      this.$emit('selectedDate', this.date, this.dateGranularity)
    },
    // Emits the original date, closes the dialog and resets any error messages
    cancel () {
      // Close menu
      this.menu = false

      // Reset any error messages
      this.errors = []

      // Reset to start elements
      this.date = this.startDate
      this.dateGranularity = this.startDateGranularity

      // Emit date pieces (1-indexed month) and date granularity
      this.$emit('selectedDate', this.date, this.dateGranularity)
    }
  }
}
</script>
