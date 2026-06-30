<template>
  <tr class="technique-row">
    <td>
      <table v-if="hasSubtechniques" class="supertechnique">
        <tbody>
          <tr>
            <td class="technique">
              <attack-technique-cell :technique="technique" :is-supertechnique="true" />
            </td>
          </tr>
        </tbody>
      </table>

      <attack-technique-cell v-else :technique="technique" />
    </td>

    <td v-if="hasSubtechniques" class="sidebar" @click="doShowSubtechniques = !doShowSubtechniques">
      <div class="angle top">
        <svg width="12px" height="12px">
          <path d="M0 12H12V0Z" />
        </svg>
      </div>
      <div class="handle">=</div>
      <div class="angle bottom">
        <svg width="12px" height="12px">
          <path d="M0 0H12V12Z" />
        </svg>
      </div>
    </td>

    <td class="subtechniques-td">
      <div
        v-for="(subtechnique, k) in technique.subtechniques || []"
        :key="subtechnique.id || k"
        :class="`subtechniques subtechniques-container ${toggleShow}`"
      >
        <div class="subtechnique">
          <attack-technique-cell :technique="subtechnique" />
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup>
/**
 * Renders technique and subtechnique information on the ATLAS matrix
 */
import { ref, computed, watch } from 'vue'
import AttackTechniqueCell from '@/components/matrix/AttackTechniqueCell.vue'

const props = defineProps({
  /**
   * A list of techniques and their subtechniques to render on the matrix
   * @type {Object}
   */
  technique: Object,
  /**
   * When true, expands all subtechniques; when false, collapses them
   * @type {Boolean}
   */
  expandAll: Boolean,
  /**
   * Increments when filters change so the current global expansion mode is re-applied
   * even when expandAll itself did not change.
   * @type {Number}
   */
  expandAllRevision: Number,
})

const doShowSubtechniques = ref(false)

const hasSubtechniques = computed(() => {
  return Array.isArray(props.technique?.subtechniques) && props.technique.subtechniques.length > 0
})

watch(
  [() => props.expandAll, () => props.expandAllRevision],
  ([newVal]) => {
    doShowSubtechniques.value = newVal
  },
  { immediate: true }
)

/**
 * Opens and closes subtechnique drawers
 * @returns {string}
 */
const toggleShow = computed(() => {
  if (doShowSubtechniques.value) {
    return 'expanded'
  }
  return 'hidden'
})
</script>

<style scoped src="@/assets/matrix.css"></style>
