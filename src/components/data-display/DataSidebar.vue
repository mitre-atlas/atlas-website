<template>
  <v-card flat class="mt-10">
    <v-card-text class="text-body-2">
      <p><span class="font-weight-bold">ID:</span> {{ dataObject.id }}</p>
      <div v-if="dataObject['object-type'] != 'technique'">
        <div v-for="(relatedObjs, objectType) in dataObject.relatedObjects" :key="objectType">
          <template v-if="String(objectType) === 'maturity'">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <span v-bind="props">
                  <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" />
                </span>
              </template>
              <span >{{ getTooltipText(relatedObjs) }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" />
          </template>
        </div>
      </div>
      <div v-else>
        <div v-for="(relatedObjs,objectType) in orderedRelatedObjs">
          <template v-if="String(objectType) === 'maturity'">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <span v-bind="props">
                  <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" />
                </span>
              </template>
              <span >{{ getTooltipText(relatedObjs) }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" v-if="relatedObjs != undefined" />
          </template>
        </div>
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
import { computed } from 'vue';

const { dataObject } = defineProps(['dataObject'])

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit', timeZone: 'UTC' }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
}

function getTooltipText(relatedObjs: any): string {
  if (relatedObjs === 'feasible') {
    return 'The technique has been shown to work in a research or academic setting'
  }
  if (relatedObjs === 'demonstrated') {
    return 'The technique has been shown to be effective in a red team exercise or demonstration on a realistic AI-enabled system.'
  }
  if (relatedObjs === 'realized') {
    return 'The technique has been used by a threat actor in a real-world incident targeting an AI-enabled systems.'
  }
  return ``
}

const getNumMitigations = () => {
 if('mitigations' in dataObject.relatedObjects) {
  return dataObject.relatedObjects['mitigations'].length
 } 
 else if('mitigation' in dataObject.relatedObjects) {
  return dataObject.relatedObjects['mitigation'].length
 } 
 return 0
}

console.log(dataObject.relatedObjects)

const orderedRelatedObjs = computed(() => ({
  "subtechniques": 'maturity' in dataObject.relatedObjects ? dataObject.relatedObjects['subtechniques'] : undefined,
  "subtechnique-of": 'parent-technique' in dataObject.relatedObjects ? dataObject.relatedObjects['parent-technique'] : undefined,
  "other-subtechniques": 'other subtechniques' in dataObject.relatedObjects ? dataObject.relatedObjects['other subtechniques'] : undefined,
  "tactic": 'tactic' in dataObject.relatedObjects ? dataObject.relatedObjects['tactic'] : undefined,
  "maturity": 'maturity' in dataObject.relatedObjects ? dataObject.relatedObjects['maturity'] : undefined,
  "number-of-case-studies": 'case-study' in dataObject.relatedObjects ? dataObject.relatedObjects['case-study'].length : 0,
  "number-of-mitigations": getNumMitigations(),
}))
</script>
