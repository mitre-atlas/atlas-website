<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="inherit" v-bind="props" prepend-icon="mdi-download" append-icon="mdi-menu-down">
        Download Data
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(option, index) in options"
        :key="index"
        :value="index"
        :title="option.title"
        @click="option.function"
      >
        <template v-slot:prepend>
          <v-icon :icon="option.icon" size="small" style="margin-right: -18px" />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { downloadStudyFile } from '@/assets/tools.js'
import { makePPT } from '@/assets/powerpointFunctions.js'
import { useMain } from '@/stores/main'

const mainStore = useMain()

const { study } = defineProps([
  /**
   * Data object type (e.g. tactics)
   * @type {Object}
   */
  'study'
])

const options = [
  {
    title: 'PowerPoint (.pptx)',
    icon: 'mdi-file-powerpoint-box-outline',
    function: () => downloadPPT()
  },
  {
    title: 'Raw data (.yaml)',
    icon: 'mdi-file',
    function: () => downloadStudyFile({ study: study }, study.id)
  }
]

async function downloadPPT() {
  for (const procedure of study.procedure) {
    const technique = await mainStore.getDataObjectById(procedure.technique)
    procedure.techniqueObject = technique
  }
  makePPT(study)
  // delete techniqueObjects, which are only needed in makePPT
  study.procedure.forEach((procedure) => {
    delete procedure.techniqueObject
  })
}
</script>
