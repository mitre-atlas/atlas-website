<template>
  <v-select
    v-model="selected"
    clearable
    chips
    :label="`Filter by ${filterType === 'category' ? 'category' : 'ML lifecycle stage'}`"
    :items="options"
    multiple
    @update:modelValue="onDropdownChange"
  >
  </v-select>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { getDescriptions } from '@/assets/tools.js'

const { categories, stages } = defineProps([
  /**
   * Array of categories
   * @type {Array}
   */
  'categories',
  /**
   * Array of ML lifecycle stages
   * @type {Array}
   */
  'stages'
])
const emit = defineEmits(['updateFilters'])

const filterType = computed(() => {
  if (categories) return 'category'
  return 'ML-lifecycle'
})

let options = reactive(categories ? categories : stages)

const selected = ref([])

function onDropdownChange() {
  emit('updateFilters', filterType.value, selected.value)
}

const terms = ref([])

fetchDescriptions()

async function fetchDescriptions() {
  try {
    terms.value = await getDescriptions()
    const termNames = terms.value.map((term) => term.name)
    options.sort((a, b) => termNames.indexOf(a) - termNames.indexOf(b))
  } catch (error) {
    console.error('Failed to fetch descriptions:', error)
    terms.value = []
  }
}
</script>
