<!-- Info card to the side of an individual case study page -->

<template>
  <v-card flat>
    <v-list subheader>
      <v-subheader>Incident date</v-subheader>
      <study-details-list-item>{{ formattedDate }}</study-details-list-item>

      <v-subheader>Reported by</v-subheader>
      <study-details-list-item>{{ study['reported-by'] }}</study-details-list-item>

      <v-subheader>Additional views</v-subheader>
      <v-list-item>
        <download-data-files-dropdown :study="study" />
      </v-list-item>
      <v-list-item>
        <navigator-layer-dropdown :study="study" />
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
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

      const dateGranularity = this.study['incident-date-granularity']
      if (dateGranularity === 'YEAR') {
        // Year only
        return date.toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric' }
        )
      } else if (dateGranularity === 'MONTH') {
        // Month and year
        return date.toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long' }
        )
      } else {
        // If dateGranularity is DATE, or there is no date granularity, use the full date
        return date.toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
        )
      }
    }
  }
}
</script>
