<template>
  <span>
    <v-tooltip v-for="(tag, i) in tags" :key="i" :text="getTagDescription(tag)" location="top">
      <template v-slot:activator="{ props }">
        <!-- <v-btn v-bind="props">Tooltip</v-btn> -->
        <v-chip class="ma-1" density="compact" variant="outlined" label v-bind="props">
          {{ tag }}
        </v-chip>
      </template>
    </v-tooltip>
  </span>
</template>

<script setup>
import { ref } from 'vue'
import { getDescriptions } from '@/assets/tools.js'

const { tags } = defineProps([
  /**
   * String array represnting tags
   */
  'tags'
])

const terms = ref([])

fetchDescriptions()

async function fetchDescriptions() {
  try {
    terms.value = await getDescriptions()
  } catch (error) {
    console.error('Failed to fetch descriptions:', error)
    terms.value = []
  }
}

function getTagDescription(name) {
  if (!terms.value.length) return ''
  const matchingTerm = terms.value.find((t) => t.name === name)
  if (matchingTerm) {
    return matchingTerm.description
  }

  // Not found
  return 'Definition not found'
}
</script>
