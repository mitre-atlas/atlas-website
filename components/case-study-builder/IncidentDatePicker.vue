<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
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
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="green" @click="ok">OK</v-btn>
          </v-card-actions>
        </v-date-picker>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
export default {
  name: 'IncidentDatePicker',
  props: [
    'startYear',
    'startMonth',
    'startDate'
  ],
  data () {
    return {
      activePicker: null,
      menu: false,
      date: (this.startYear) ? new Date(this.startYear, this.startMonth - 1, this.startDate) : null,
      dateGranularity: null,
      // displayedIncidentDate: null,
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  computed: {
    // date () {
    //   if (this.startYear) {
    //     return new Date(this.startYear, this.startMonth - 1, this.startDate)
    //   }
    //   return null
    // },
    dateISOString () {
      // Set the date-picker date
      if (this.date) {
        return this.date.toISOString()
      }
      return null
    },
    displayedIncidentDate () {
      if (this.dateGranularity === 'YEAR') {
        return `${this.date.getUTCFullYear()}`
      } else if (this.dateGranularity === 'MONTH') {
        return `${this.monthNames[this.date.getUTCMonth()]} ${this.date.getUTCFullYear()}`
      } else if ((this.date !== null && this.dateGranularity === null) || this.dateGranularity === 'DATE') {
        // If dateGranularity is DATE, or there is no date granularity
        return `${this.monthNames[this.date.getUTCMonth()]}  ${this.date.getUTCDate()}, ${this.date.getUTCFullYear()}`
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
      // Construct display date of full month, year
      // this.displayedIncidentDate = `${this.monthNames[this.date.getUTCMonth()]} ${this.date.getUTCFullYear()}`
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
      // Construct display date of full month, day, year
      // this.displayedIncidentDate = `${this.monthNames[this.date.getUTCMonth()]}  ${this.date.getUTCDate()}, ${this.date.getUTCFullYear()}`
    },
    ok () {
      // Close menu
      this.menu = false
      // Emit date pieces (1-indexed month) and date granularity
      this.$emit('selectedDate', this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.dateGranularity)
    }
  }
}
</script>
