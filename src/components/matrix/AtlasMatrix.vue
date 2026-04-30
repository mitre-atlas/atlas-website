<template>
  <div>
    <div class="matrix-columns">
      <div class="matrix-text">ATLAS Matrix for AI Systems</div>
      <div class="matrix-controls-group">
        <div class="matrix-filter">
          <Fieldset class="fieldset-border">
            <legend class="fieldset-legend">Subtechniques</legend>
            <v-btn-toggle
              v-model="expandAllIndex"
              mandatory
              variant="outlined"
              density="compact"
              class="subtechniques-toggle"
            >
              <v-btn value="0" size="small" class="text-capitalize">Expand all</v-btn>
              <v-btn value="1" size="small" class="text-capitalize">Collapse all</v-btn>
            </v-btn-toggle>
          </Fieldset>
        </div>
        <div class="matrix-filter">
          <Fieldset class="fieldset-border">
            <legend class="fieldset-legend">Filter by Maturity</legend>
            <v-slider
              v-model="selectedCategoryIndex"
              :max="2"
              :ticks="maturity_types"
              show-ticks="always"
              tick-size="3"
              step="1"
              class="slider-width"
              thumb-label
              thumb-color="#1976d2"
              track-color="#ccc"
              track-fill-color="#1976d2"
            >
              <template v-slot:thumb-label="{ selectedCategory }">
                {{ maturity_types_info[selectedCategoryIndex] }}
              </template>
            </v-slider>
          </Fieldset>
        </div>
      </div>
    </div>
    <MatrixAttackStyle
      :tactics="tactics"
      :expand-all="expandAll"
      style="overflow: auto"
    ></MatrixAttackStyle>
    <div class="text-right mt-2">
      <span class="attack-and">&amp;</span>&nbsp;indicates a tactic or technique is adapted from
      <a href="https://attack.mitre.org/" target="_blank" >MITRE ATT&CK®</a >
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMain } from '@/stores/main'
import MatrixAttackStyle from './MatrixAttackStyle.vue'
import { constructNavigatorLayerGitHubUrl, constructNavigatorUrlToLayer } from '@/assets/tools.js'

const mainStore = useMain()

//TODO- track this constant and connect with data
const maturity_types = {
  0: 'Feasible',
  1: 'Demonstrated',
  2: 'Realized'
}

const maturity_types_info = [
  'The technique has been shown to work in a research or academic setting',
  'The technique has been shown to be effective in a red team exercise or demonstration on a realistic AI-enabled system.',
  'The technique has been used by a threat actor in a real-world incident targeting an AI-enabled systems.'
]

const selectedCategoryIndex = ref(0)
const expandAllIndex = ref('1')

const expandAll = computed(() => expandAllIndex.value === '0')

const selectedCategory = computed(() => maturity_types[selectedCategoryIndex.value])

const tactics = computed(() => {
  if (selectedCategory.value == 'Feasible') {
    return mainStore.getDataObjectsByType('tactics', 'ATLAS')
  } else if (selectedCategory.value == 'Demonstrated') {
    return mainStore.getDataObjectsFilteredbyNestedKeyValue(
      'tactics',
      'techniques',
      'maturity',
      ['demonstrated', 'realized'],
      'ATLAS'
    )
  } else if (selectedCategory.value == 'Realized') {
    return mainStore.getDataObjectsFilteredbyNestedKeyValue(
      'tactics',
      'techniques',
      'maturity',
      ['realized'],
      'ATLAS'
    )
  }
})

// Construct link to open the case study frequency Navigator layer on the ATLAS Navigator
const matrixLayerGitHubUrl = constructNavigatorLayerGitHubUrl(
  'atlas_layer_matrix',
  'dist/default-navigator-layers'
)
const matrixNavigatorUrl = constructNavigatorUrlToLayer(matrixLayerGitHubUrl)
</script>

<style scoped src="@/assets/matrix.css"></style>
