<template>
  <v-card flat >

    <!-- <v-card-text>
      <div class="text-body-1 text--primary font-weight-medium">
      {{ study.summary }}
      </div>
    </v-card-text> -->

    <v-list subheader>

      <v-subheader>Incident date</v-subheader>
      <study-details-list-item :itemList="formattedDate" />

      <v-subheader>Reported by</v-subheader>
      <study-details-list-item :itemList="study['reported-by']" />

      <!-- <template>
        <div>
          <v-list-item>
            <v-list-item>
              <v-list-item-title>
                <a :href=$config.individual_case_study.link+(study.id)+$config.individual_case_study.suffix target='_blank' style='color: inherit'>ATLAS Navigator: {{study.id}}</a>
              </v-list-item-title>
            </v-list-item>
          </v-list-item>
        </div>
      </template> -->

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
    }
  }
}
</script>
