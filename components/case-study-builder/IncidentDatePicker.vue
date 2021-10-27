<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :close-on-click="false"
      transition="scale-transition"
      bottom
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="displayedIncidentDate"
          label="Incident date"
          hint="Only the year is required, but please specify month and day where possible"
          prepend-inner-icon="mdi-calendar"
          outlined
          readonly
          v-bind="attrs"
          v-on="on"
          :rules="[v => !!v || 'Required']"
        ></v-text-field>
      </template>

      <v-card>
        <v-date-picker
          flat
          no-title
          v-model="dateISOString"
          :active-picker.sync="activePicker"
          :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
          min="1970-01-01"
          @click:year="yearSelected"
          @click:month="monthSelected"
          @click:date="dateSelected"
        >
          <!-- <v-card-actions> -->
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="cancel">Cancel</v-btn>
            <v-btn text color="primary" @click="ok">OK</v-btn>
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
    'startDateGranularity'
  ],
  data () {
    return {
      activePicker: null,
      menu: false,
      date: this.startDate,
      dateGranularity: this.startDateGranularity
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
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
    }
  },
  computed: {
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
          return this.date.toLocaleDateString(
            'default',
            { timeZone: 'UTC', year: 'numeric' }
          )
        } else if (this.dateGranularity === 'MONTH') {
          return this.date.toLocaleDateString(
            'default',
            { timeZone: 'UTC', year: 'numeric', month: 'long' }
          )
        } else if (this.dateGranularity == null || this.dateGranularity === 'DATE') {
          // If dateGranularity is DATE, or there is no date granularity
          return this.date.toLocaleDateString(
            'default',
            { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
          )
        }
      }
      return null
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

      // Emit date pieces (1-indexed month) and date granularity
      this.$emit('selectedDate', this.date, this.dateGranularity)
    },
    cancel () {
      // Close menu
      this.menu = false

      // Reset to start elements
      this.date = this.startDate
      this.dateGranularity = this.startDateGranularity

      // Emit date pieces (1-indexed month) and date granularity
      this.$emit('selectedDate', this.date, this.dateGranularity)
    }
  }
}
</script>
