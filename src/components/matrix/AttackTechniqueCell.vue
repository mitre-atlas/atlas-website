<template>
  <div :class="computedClass">
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <router-link :to="`/techniques/${props.technique.id}`">
          {{
            props.technique.name.substr(
              0,
              props.technique.name.length - techniqueLastWord.length
            )
          }}
          <div style="white-space: nowrap">
            {{ techniqueLastWord }}
            <span v-if="'ATT&CK-reference' in props.technique" class="attack-and">&</span>
          </div>
        </router-link>
      </template>
      <span>{{ props.technique.id }}</span>
    </v-tooltip>
  </div>
</template>

<script setup>
/**
 * Adds linking to the technique boxes
 */
import { computed } from 'vue'
import { lastWord } from '@/assets/tools.js'

const props = defineProps({
  /**
   * Object containing information about the technique to render
   * @type {Object}
   */
  technique: Object,
  /**
   * Determines if the technique has subtechniques
   * @type {Boolean}
   */
  isSupertechnique: Boolean
})

const computedClass = computed(() => {
  let className = 'technique-cell'
  if (props.isSupertechnique) {
    className += ' supertechniquecell'
  }
  return className
})

const techniqueLastWord = computed(() => {
  return lastWord(props.technique.name)
})
</script>

<style scoped src="@/assets/matrix.css">
</style>
