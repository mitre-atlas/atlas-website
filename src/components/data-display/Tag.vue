<template>
  <span class="tag-list">
    <v-tooltip
      v-for="(tag, i) in tags"
      :key="i"
      :text="getTagDescription(tag)"
      location="top"
      content-class="data-sidebar-tooltip"
      max-width="260"
    >
      <template v-slot:activator="{ props }">
        <v-chip
          class="term-chip ma-1"
          :class="chipClass"
          density="compact"
          variant="tonal"
          label
          size="small"
          v-bind="props"
        >
          <span class="term-chip-dot" aria-hidden="true"></span>
          <span class="term-chip-text">{{ tag }}</span>
        </v-chip>
      </template>
    </v-tooltip>
  </span>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getDescriptions } from '@/assets/tools.js'
import { getAtlasTermDescription, isAtlasTermGroupKey } from '@/config/atlasTermCatalog'

const { tags, termGroup } = defineProps([
  /**
   * String array represnting tags
   */
  'tags',
  /**
   * Optional centralized term definition group key
   */
  'termGroup',
])

const terms = ref([])

const chipClass = computed(() => {
  if (typeof termGroup !== 'string') {
    return 'term-chip--default'
  }

  switch (termGroup) {
    case 'maturity':
      return 'term-chip--maturity'
    case 'platforms':
      return 'term-chip--platforms'
    case 'categories':
      return 'term-chip--categories'
    case 'lifecycle-phases':
      return 'term-chip--lifecycle'
    case 'case-study-type':
      return 'term-chip--case-study-type'
    default:
      return 'term-chip--default'
  }
})

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
  if (typeof termGroup === 'string' && isAtlasTermGroupKey(termGroup)) {
    const description = getAtlasTermDescription(termGroup, name)
    if (description) {
      return description
    }
  }

  if (!terms.value.length) return ''
  const matchingTerm = terms.value.find((t) => t.name === name)
  if (matchingTerm) {
    return matchingTerm.description
  }

  // Not found
  return 'Definition not found'
}
</script>

<style scoped>
.tag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.term-chip {
  border: 0;
  border-radius: 999px;
  font-weight: 500;
  letter-spacing: 0;
}

.term-chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  margin-right: 6px;
  flex-shrink: 0;
  background: currentColor;
  opacity: 0.85;
}

.term-chip-text {
  line-height: 1.2;
}

.term-chip--default {
  background-color: #f1f3f4;
  color: #2d4862;
}

.term-chip--maturity {
  background-color: #edf6fa;
  color: #0d2f4f;
}

.term-chip--platforms {
  background-color: #e8f7ff;
  color: #005b94;
}

.term-chip--categories {
  background-color: #fff8cc;
  color: #0e2f4f;
}

.term-chip--lifecycle {
  background-color: #f1f3f4;
  color: #0e2f4f;
}

.term-chip--case-study-type {
  background-color: #efe8ff;
  color: #4957b2;
}

::v-deep(.data-sidebar-tooltip) {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.35;
}
</style>
