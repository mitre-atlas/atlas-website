<template>
  <div :class="computedClass">
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <nuxt-link
          :to="`/techniques/${technique.id}`"
          v-bind="attrs"
          v-on="on"
        >
          {{ technique.name.substr(0, (technique.name.length - techniqueLastWord.length)) }}
          <div style="white-space: nowrap;">
            {{ techniqueLastWord }}
            <span v-if="'ATT&CK-reference' in technique" class="attack-and">&</span>
          </div>
        </nuxt-link>
      </template>
      <span>{{ technique.id }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { lastWord } from '~/assets/tools.js'
/**
 * Adds linking to the technique boxes
 */
export default {
  name: 'AttackTechniqueCell',
  props: [
    /**
     * Object containing information about the technique to render
     * @type {Object}
     */
    'technique',
    /**
     * Determines if the technique has subtechniques
     * @type {Boolean}
     */
    'isSupertechnique'
  ],
  computed: {
    /**
     * Determines class name(s) which edit the css based on if the object has subtechniques
     * @returns {string}
     */
    computedClass () {
      let className = 'technique-cell'
      if (this.isSupertechnique) {
        className += ' supertechniquecell'
      }
      return className
    },
    techniqueLastWord () {
      return lastWord(this.technique.name)
    }
  }
}
</script>

<style scoped src="~/assets/matrix.css">
</style>
