<template>
  <div>
    <div class="matrix-columns">
      <div class="matrix-text">ATLAS Matrix for AI Systems</div>
      <div class="matrix-controls-group">
        <div class="matrix-filter">
          <Fieldset class="fieldset-border">
            <legend class="fieldset-legend">
              <span class="legend-with-info">
                <v-tooltip
                  :text="subtechniquesTooltip"
                  location="top"
                  content-class="matrix-filter-tooltip"
                  max-width="260"
                >
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="small" class="legend-info-icon">mdi-information-outline</v-icon>
                  </template>
                </v-tooltip>
                Subtechniques
              </span>
            </legend>
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
            <legend class="fieldset-legend">
              <span class="legend-with-info">
                <v-tooltip
                  :text="getAtlasGroupDescription('platforms')"
                  location="top"
                  content-class="matrix-filter-tooltip"
                  max-width="260"
                >
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="small" class="legend-info-icon">mdi-information-outline</v-icon>
                  </template>
                </v-tooltip>
                Filter by Platforms
              </span>
            </legend>
            <div class="platform-chip-group" role="group" aria-label="Filter techniques by platform">
              <v-tooltip
                v-for="platform in platformOptions"
                :key="platform"
                :text="getAtlasTermDescription('platforms', platform)"
                location="top"
                content-class="matrix-filter-tooltip"
                max-width="260"
              >
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    :variant="isPlatformSelected(platform) ? 'flat' : 'outlined'"
                    color="navy"
                    class="platform-chip"
                    @click="togglePlatform(platform)"
                  >
                    <v-icon
                      :icon="isPlatformSelected(platform) ? 'mdi-check' : 'mdi-close'"
                      size="small"
                      start
                    />
                    {{ platform }}
                  </v-chip>
                </template>
              </v-tooltip>
            </div>
          </Fieldset>
        </div>
        <div class="matrix-filter">
          <Fieldset class="fieldset-border">
            <legend class="fieldset-legend">
              <span class="legend-with-info">
                <v-tooltip
                  :text="getAtlasGroupDescription('maturity')"
                  location="top"
                  content-class="matrix-filter-tooltip"
                  max-width="260"
                >
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="small" class="legend-info-icon">mdi-information-outline</v-icon>
                  </template>
                </v-tooltip>
                Filter by Maturity
              </span>
            </legend>
            <v-tooltip
              :text="maturityLevelDescriptions[selectedCategoryIndex]"
              location="top"
              content-class="matrix-filter-tooltip"
              max-width="260"
            >
              <template #activator="{ props }">
                <v-slider
                  v-bind="props"
                  v-model="selectedCategoryIndex"
                  :max="maturityLevels.length - 1"
                  :ticks="maturityTicks"
                  show-ticks="always"
                  tick-size="3"
                  step="1"
                  class="slider-width"
                  thumb-color="navy"
                  track-color="#ccc"
                  track-fill-color="navy"
                />
              </template>
            </v-tooltip>
          </Fieldset>
        </div>
      </div>
    </div>
    <MatrixAttackStyle
      :tactics="tactics"
      :expand-all="expandAll"
      :expand-all-revision="expandAllRevision"
      style="overflow: auto"
    ></MatrixAttackStyle>
    <div class="text-right mt-2">
      <span class="attack-and">&amp;</span>&nbsp;indicates a tactic or technique is adapted from
      <a href="https://attack.mitre.org/" target="_blank" rel="noreferrer" >MITRE ATT&CK®</a >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMain } from '@/stores/main'
import MatrixAttackStyle from './MatrixAttackStyle.vue'
import {
  getAtlasTermValues,
  getAtlasTermDescription,
  getAtlasGroupDescription
} from '@/config/atlasTermCatalog'

const mainStore = useMain()

const maturityLevels = getAtlasTermValues('maturity')
const maturityTicks = Object.fromEntries(maturityLevels.map((value, index) => [index, value]))
const maturityLevelDescriptions = maturityLevels.map((value) =>
  getAtlasTermDescription('maturity', value)
)
const knownPlatforms = getAtlasTermValues('platforms')
const knownPlatformSet = new Set(knownPlatforms)
const subtechniquesTooltip =
  'Expand or collapse subtechnique rows beneath each parent technique in the matrix.'

const selectedCategoryIndex = ref(0)
const expandAllIndex = ref('1')
const selectedPlatforms = ref([])
const hasInitializedPlatforms = ref(false)
const expandAllRevision = ref(0)

const expandAll = computed(() => expandAllIndex.value === '0')

const selectedCategory = computed(() => maturityLevels[selectedCategoryIndex.value])

const matrixId = computed(() => mainStore.getFirstMatrixId)

const platformOptions = computed(() => {
  return [...knownPlatforms]
})

watch(
  platformOptions,
  (options) => {
    if (!hasInitializedPlatforms.value && options.length > 0) {
      selectedPlatforms.value = [...options]
      hasInitializedPlatforms.value = true
    }
  },
  { immediate: true }
)

watch([selectedCategoryIndex, selectedPlatforms], () => {
  expandAllRevision.value += 1
})

const shouldShowTechniqueForPlatforms = (technique) => {
  const techniquePlatforms = (technique.platforms || []).filter((platform) =>
    knownPlatformSet.has(platform)
  )
  if (techniquePlatforms.length === 0) {
    return true
  }

  return selectedPlatforms.value.some((platform) => techniquePlatforms.includes(platform))
}

const isPlatformSelected = (platform) => selectedPlatforms.value.includes(platform)

const togglePlatform = (platform) => {
  if (isPlatformSelected(platform)) {
    if (selectedPlatforms.value.length <= 1) {
      return
    }
    selectedPlatforms.value = selectedPlatforms.value.filter((value) => value !== platform)
    return
  }

  selectedPlatforms.value = [...selectedPlatforms.value, platform].sort((a, b) =>
    a.localeCompare(b)
  )
}

const tactics = computed(() => {
  const filterByPlatforms = (tacticList) => {
    return tacticList
      .map((tactic) => {
        const techniques = tactic.techniques
          .map((technique) => {
            const subtechniques = (technique.subtechniques || []).filter(shouldShowTechniqueForPlatforms)
            return { ...technique, subtechniques }
          })
          .filter((technique) => {
            return shouldShowTechniqueForPlatforms(technique) || technique.subtechniques.length > 0
          })
        return { ...tactic, techniques }
      })
      .filter((tactic) => tactic.techniques.length > 0)
  }

  if (selectedCategory.value === 'Feasible') {
    return filterByPlatforms(mainStore.getDataObjectsByType('tactics', matrixId.value))
  } else if (selectedCategory.value === 'Demonstrated') {
    return filterByPlatforms(
      mainStore.getDataObjectsFilteredbyNestedKeyValue(
      'tactics',
      'techniques',
      'maturity',
      ['Demonstrated', 'Realized'],
      matrixId.value
    )
    )
  } else if (selectedCategory.value === 'Realized') {
    return filterByPlatforms(
      mainStore.getDataObjectsFilteredbyNestedKeyValue(
      'tactics',
      'techniques',
      'maturity',
      ['Realized'],
      matrixId.value
      )
    )
  }

  return []
})

</script>

<style scoped src="@/assets/matrix.css"></style>
