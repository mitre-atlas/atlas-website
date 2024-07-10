<template>
  <v-card flat class="mt-10">
    <v-card-text class="text-body-2">
      <p><span class="font-weight-bold">ID:</span> {{ dataObject.id }}</p>
      <div v-for="(relatedObjs, objectType) in dataObject.relatedObjects" :key="objectType">
        <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" />
      </div>
      <div class="pb-4">
        <span class="font-weight-bold">Created:</span>
        {{ formatDate(dataObject.created_date) }}
      </div>
      <div>
        <span class="font-weight-bold">Last Modified:</span>
        {{ formatDate(dataObject.modified_date) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import DataSidebarEntry from '@/components/data-display/DataSidebarEntry.vue'

const { dataObject } = defineProps(['dataObject'])

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit', timeZone: 'UTC' }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
}

</script>
