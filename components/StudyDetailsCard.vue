<template>
  <v-card flat>

    <!-- <v-card-text>
      <div class="text-body-1 text--primary font-weight-medium">
      {{ study.summary }}
      </div>
    </v-card-text> -->

    <v-list subheader>
      <v-subheader>Incident date</v-subheader>
      <!-- <v-list-item>
        <v-list-item>
          <v-list-item-content>
            {{ formattedDate }}
          </v-list-item-content>
        </v-list-item>
      </v-list-item> -->
      <study-details-list-item :itemList="formattedDate" />

      <v-subheader>Reported by</v-subheader>
      <study-details-list-item :itemList="study['reported-by']" />

      <v-subheader>Verified by</v-subheader>
      <study-details-list-item :itemList="study['verified-by']" />

      <!-- <v-subheader>Sources</v-subheader>
      <study-details-list-item :itemList="study.sources" /> -->

    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'StudyDetailsCard',
  props: ['study'],
  computed: {
    formattedDate () {
      const date = new Date(this.study['incident-date'])
      // i.e. January 1, 2021
      return date.toLocaleDateString(
        'default',
        { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
      )
    }
  }
}
</script>
