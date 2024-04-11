<template>
  <v-expansion-panels flat hover>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="text-h5">Past Events</div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
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
              <v-icon size="x-small"> mdi-open-in-new </v-icon>
            </a>
          </template>
          <template #[`item.description`]="{ item }">
            <div class="my-3 tw-prose tw-max-w-none" v-html="md.render(item.description)" />
          </template>
        </v-data-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script setup>
import { computed, inject } from 'vue'
const md = inject('markdownit')

const { events } = defineProps([
  /**
   * A list of events to diplay in a timeline.
   * @type {Object}
   */
  'events'
])

/**
 * Headers for the data table.
 * @type {Array}
 */
const headers = computed(() => [
  {
    title: 'Date',
    key: 'date',
    align: 'end'
  },
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Summary',
    key: 'description'
  }
])
</script>
