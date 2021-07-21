<template>
  <div>
    <v-row>
      <v-col sm=4 class="pl-0">
        <v-autocomplete
          v-model="yearReturn"
          :items="getLast100"
          label="Year"
          required
          :rules="[v => !!v || 'Year is required']"
          prepend-icon="mdi-calendar"
          @input="$emit('yearUpdate', yearReturn)"
        />
      </v-col>
      <v-col sm=4 class="pl-0">
        <v-autocomplete
          sm=4
          class="pl-0"
          v-model="monthReturn"
          :items="getMonths"
          label="Month"
          :disabled="!yearReturn"
          item-text="name"
          item-value="num"
          prepend-icon="mdi-calendar"
          @input="$emit('monthUpdate', monthReturn)"
        />
      </v-col>
      <v-col sm=4 class="pl-0">
        <v-autocomplete
          sm=4
          class="pl-0"
          v-model="dateReturn"
          :items="getDate"
          label="Date"
          :disabled="!monthReturn"
          prepend-icon="mdi-calendar"
          @input="$emit('dateUpdate', dateReturn)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'DateSelect',
  props: ['year', 'month', 'date'],
  data () {
    return {
      yearReturn: this.year,
      monthReturn: this.month,
      dateReturn: this.date
    }
  },
  computed: {
    getLast100 () {
      // allows insertion through the past 100 years
      const years = []
      const currYear = new Date().getFullYear()
      for (let i = currYear; i >= currYear - 100; i--) {
        years.push(i)
      }
      return years
    },
    getMonths () {
      // gives month name and numerical for creation of date obj
      return [
        { name: 'January', num: 1 },
        { name: 'February', num: 2 },
        { name: 'March', num: 3 },
        { name: 'April', num: 4 },
        { name: 'May', num: 5 },
        { name: 'June', num: 6 },
        { name: 'July', num: 7 },
        { name: 'August', num: 8 },
        { name: 'September', num: 9 },
        { name: 'October', num: 10 },
        { name: 'November', num: 11 },
        { name: 'December', num: 12 }
      ]
    },
    getDate () {
      // finds numbers of days in month given selected month and year
      const isleap = (this.yearReturn % 4 === 0 && (this.yearReturn % 100 !== 0 || this.yearReturn % 400 === 0))
      const days = []
      let numDays = 0
      if (isleap && this.monthReturn === 2) {
        numDays = 29
      } else if (this.monthReturn === 2) {
        numDays = 28
      } else if (this.monthReturn === 4 || this.monthReturn === 6 || this.monthReturn === 9 || this.monthReturn === 11) {
        numDays = 30
      } else { numDays = 31 }
      for (let i = 1; i <= numDays; i++) {
        days.push(i)
      }
      return days
    }
  }
}
</script>
