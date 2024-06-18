<template>
  <v-timeline side="end" class="ml-6 mt-6">
    <v-timeline-item
      v-for="(procedure, i) in study.procedure"
      :key="i"
      dot-color="blue"
      size="medium"
      width="100%"
    >
      <v-card>
        <template v-slot:title>
          <router-link class="text-black" :to="`/techniques/${procedure.technique}`">
            {{ getTechniqueLabel(procedure.technique) }}
          </router-link>
        </template>
        <template v-slot:subtitle>
          <router-link class="text-black" :to="`/tactics/${procedure.tactic}`">
            {{ getTacticName(procedure.tactic) }}
          </router-link>
        </template>
        <v-card-text v-html="md.render(procedure.description)" />
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
import { useMain } from '@/stores/main'
import markdownit from 'markdown-it'
const md = markdownit({
  html: true
})
const mainStore = useMain()

const { study } = defineProps([
  /**
   * Data object type (e.g. tactics)
   * @type {Object}
   */
  'study'
])

function getTechniqueLabel(technique) {
  return mainStore.getDataObjectById(technique).label
}

function getTacticName(tactic) {
  return mainStore.getDataObjectById(tactic).name
}
</script>
