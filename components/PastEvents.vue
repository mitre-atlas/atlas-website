<template>
  <v-expansion-panels flat>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <page-section-title>
          Past Events
        </page-section-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
          :headers="headers"
          :items="events"
          :items-per-page="5"
          >
          <template #[`item.date`]="{ item }">
            <div class="text-right">
              {{
                item.date.toLocaleDateString(
                  'default',
                  { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
                )
              }}
            </div>
          </template>
          <template #[`item.name`]="{ item }">
            <a
              class="font-weight-medium"
              :href="item.url"
              target="_blank"
            >
              {{ item.name }}
              <v-icon
                x-small
              >
                mdi-open-in-new
              </v-icon>
            </a>
          </template>
          <template v-slot:[`item.description`]="{ item }">
            <div
              v-html="$md.render(item.description)"
              class="my-3"
            />
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  name: 'PastEvents',
  props: ['events'],
  data () {
    return {
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
