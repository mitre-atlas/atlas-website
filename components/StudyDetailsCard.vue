<!-- Info card to the side of an individual case study page -->

<template>
  <v-card flat>
    <!-- <v-list> -->
      <!-- if-else displays different icons based on case study type -->
       <v-subheader>Case Study Type</v-subheader>
        <study-details-list-item style="text-transform: capitalize;" v-if="study['case-study-type']">
          <v-icon v-if="study['case-study-type'] === 'exercise'"> mdi-clipboard-file-outline </v-icon>
          <v-icon v-else-if="study['case-study-type'] === 'incident'"> mdi-alert-octagon-outline </v-icon>
          <v-icon v-else></v-icon>
          {{ study['case-study-type'] }}</study-details-list-item>
        <study-details-list-item v-else>No case study type found</study-details-list-item> -->

        <!-- <v-subheader>Incident Date</v-subheader>
        <study-details-list-item v-if='study["incident-date"]'>{{ formattedDate }}</study-details-list-item>
        <study-details-list-item v-else>No Incident Date Found</study-details-list-item> -->

        <!-- for-loop loops thorugh actor, reporter, and targer to reduce repeated code -->
        <!-- did not include case study types, incident date, and additional info are not included in the
        for-loop because they have different formats or different displayed information -->

      <!-- <div subheader v-for='section in subHeaders' :key='section'>
        <v-subheader>{{ section }}</v-subheader>
        <study-details-list-item>{{ getField(section) }}</study-details-list-item>
      </div> -->

      <!-- <v-subheader>Additional views</v-subheader>
      <v-list-item>
        <download-data-files-dropdown :study="study" />
      </v-list-item>
      <v-list-item v-if="$config.navigator_url">
        <navigator-layer-dropdown :study="study" />
      </v-list-item>
    </v-list> -->
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
  // subHeaders represents the subheadings that are involved in the for-loop in template
  data () {
    return { subHeaders: ['Reporter', 'Actor', 'Target'] }
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
  },
  // returns an output based on whether or not the actor, etc. is empty
  methods: {
    getField (section) {
      if (this.study[section.toLowerCase()]) {
        return this.study[section.toLowerCase()]
      } else {
        return 'No ' + section + ' found'
      }
    }
  }
}
</script>
