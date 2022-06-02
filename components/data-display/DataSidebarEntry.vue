<template>
  <div>
    <span class="font-weight-bold">{{ key }}:</span>
    <span v-if="isValuePrimitive">
      {{ value }}
    </span>
    <span v-else>
      <!-- Is an Array of data objects -->
      <span v-for="(v, i) in value" :key="i">
        <span v-if="i > 0">,</span>
        <nuxt-link :to="v.route">{{ v.name }}</nuxt-link>
      </span>
    </span>
  </div>
</template>
<script>
import { capitalize } from '~/assets/tools.js'
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

export default {
  name: 'DataSidebarEntry',
  props: ['objectType', 'relatedObjs'],
  data () {
    return {
      maxNumDisplay: 3
    }
  },
  computed: {
    isStringProperty () {
      // The value is a string, i.e. this key-value pair is a string property rather than a data object
      return typeof this.relatedObjs === 'string'
    },
    doShowInfo () {
      // Display items if the number of values fall below the defined threshold
      return Array.isArray(this.relatedObjs) && this.relatedObjs.length <= this.maxNumDisplay
    },
    key () {
      // Header
      const plural = dataObjectToPluralTitle(this.objectType)

      if (this.isStringProperty || this.relatedObjs.length === 1) {
        // String property or singular item in list (if key happens to be singular)
        // Capitalize the space-separated title, no auto-pluralization
        const tokens = this.objectType.split('-')
        const title = tokens.join(' ')
        return capitalize(title)
      } else if (this.doShowInfo) {
        // Capitalize the plural version of the title
        return capitalize(plural)
      } else {
        // Summarize count
        return `Number of ${plural}`
      }
    },
    value () {
      // Display string property or object links under a certain threshold
      if (this.isStringProperty || this.doShowInfo) {
        return this.relatedObjs
      }
      // Summarize count
      return this.relatedObjs.length
    },
    isValuePrimitive () {
      const t = typeof this.value
      return (t === 'string' || t === 'number')
    }
  }
}
</script>
