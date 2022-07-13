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
        />
      </template>

      <v-card :style="cardStyle" outlined>
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
          <!-- <v-card-actions> -->
          <v-card-subtitle v-if="hasStatus" class="py-2" :style="headerStyle">
            {{ submissionStatus.message }}
          </v-card-subtitle>
          <v-spacer />
          <v-btn text color="secondary" @click="cancel">
            Cancel
          </v-btn>
          <v-btn text color="primary" @click="ok">
            OK
          </v-btn>
          <!-- </v-card-actions> -->
        </v-date-picker>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
export default {
  name: 'IncidentDatePicker',
  props: [
    'startDate',
    'startDateGranularity',
    'initialRules',
    'initialErrors',
    'submissionStatus'
  ],
  data () {
    return {
      activePicker: null,
      menu: false,
      date: this.startDate,
      dateGranularity: this.startDateGranularity,
      rules: this.initialRules,
      errors: this.initialErrors
    }
  },
  computed: {
    hasStatus () {
      return !!(this.submissionStatus ?? {}).type
    },
    isInErrorState () {
      return (this.submissionStatus ?? {}).type === 'error'
    },
    isInWarningState () {
      return (this.submissionStatus ?? []).type === 'warning'
    },
    headerStyle () {
      if (this.isInErrorState) {
        return 'color: #FF5252'
      } else if (this.isInWarningState) {
        return 'color: #DAA520'
      } else {
        return ''
      }
    },
    cardStyle () {
      const style = {}
      if (this.isInErrorState) {
        style['border-color'] = '#FF5252'
        style['border-width'] = '2px'
      } else if (this.isInWarningState) {
        style['border-color'] = '#DAA520'
        style['border-width'] = '2px'
      }
      return style
    },
    dateISOString () {
      // Set the date-picker date
      if (this.date != null) {
        return this.date.toISOString().substr(0, 10)
      }
      return null
    },
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
      this.$emit('isDatePickerOpen', val)
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
    yearSelected (year) {
      // Parameter is YYYY int
      this.dateGranularity = 'YEAR'
      // Create Date in UTC
      this.date = new Date(Date.UTC(year))
      // Construct display date
      this.displayedIncidentDate = this.date.getUTCFullYear()
    },
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
    ok () {
      // Close menu
      this.menu = false

      // Reset any error messages
      this.errors = []

      // Emit date pieces (1-indexed month) and date granularity
      this.$emit('selectedDate', this.date, this.dateGranularity)
    },
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
