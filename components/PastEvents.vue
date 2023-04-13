<template>
  <v-expansion-panels flat hover>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <page-section-title> Past Events </page-section-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table :headers="headers" :items="events" :items-per-page="5">
          <template #[`item.date`]="{ item }">
            <div class="text-right">
              {{
                item.date.toLocaleDateString('default', {
                  timeZone: 'UTC',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }}
            </div>
          </template>
          <template #[`item.name`]="{ item }">
            <a class="font-weight-medium" :href="item.url" target="_blank">
              {{ item.name }}
              <v-icon x-small> mdi-open-in-new </v-icon>
            </a>
          </template>
          <template #[`item.description`]="{ item }">
            <div
              class="my-3 tw-prose tw-max-w-none"
              v-html="$md.render(item.description)"
            />
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
/**
 * Rendered table of past events to display on the contact page.
 */
export default {
  name: 'PastEvents',
  props: [
    /**
     * A list of events in reverse chronological order to render in the table.
     * @type {Object}
     */
    'events'
  ],
  data () {
    return {
      /**
       * Headers for the data table.
       * @type {Array}
       */
      headers: [
        {
          text: 'Date',
          value: 'date',
          width: 150,
          align: 'end'
        },
        {
          text: 'Name',
          value: 'name',
          width: 100
        },
        {
          text: 'Summary',
          value: 'description',
          sortable: false
        }
      ]
    }
  }
}
</script>
