<!-- Info card to the side of an individual case study page -->

<template>
  <v-card flat>
    <v-list subheader>
      <v-subheader>Incident date</v-subheader>
      <study-details-list-item>{{ formattedDate }}</study-details-list-item>

      <v-subheader>Reported by</v-subheader>
      <study-details-list-item>{{ study['reported-by'] }}</study-details-list-item>

      <v-subheader>Files</v-subheader>
      <study-details-list-item>
        <download-data-files-dropdown :study="study" />
        <navigator-layer-dropdown :study="study" />
      </study-details-list-item>
    </v-list>
  </v-card>
</template>

<script>
import StudyDetailsListItem from './StudyDetailsListItem.vue'

export default {
  components: { StudyDetailsListItem },
  name: 'StudyDetailsCard',
  props: {
    study: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate () {
      const date = new Date(this.study['incident-date'])

      if (this.study.dateGranularity === 'YEAR') {
        // Year only
        return date.toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric' }
        )
      } else if (this.study.dateGranularity === 'MONTH') {
        // Month and year
        return date.toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long' }
        )
      // } else if (this.study.dateGranularity == null || this.study.dateGranularity === 'DATE') {
      } else {
        // If dateGranularity is DATE, or there is no date granularity, use the full date
        return date.toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
        )
      }

      /*
      // if Jan 1, assume this is just a year
      if (date.getUTCMonth() === 0 && date.getUTCDate() === 1) {
        return date.getUTCFullYear()
      } else if (date.getUTCDate() === 1) {
        // If the first of any month, use the month and year
        return date.toLocaleDateString(
          'default',
          { month: 'long', year: 'numeric', timeZone: 'UTC' }
        )
      }

      // Otherwise, this is a specific date
      // i.e. January 2, 2021
      return date.toLocaleDateString(
        'default',
        { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
      )
      */
    }
  }
}
</script>
