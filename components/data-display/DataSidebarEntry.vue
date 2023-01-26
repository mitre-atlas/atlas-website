<template>
  <div>
    <span class="font-weight-bold">{{ key }}:</span>
    <a v-if="objectType === 'ATT&CK-reference'" :href="value.url" target="_blank">
      {{ value.id }}
      <v-icon x-small>
        mdi-open-in-new
      </v-icon>
    </a>
    <span v-if="isValuePrimitive">
      {{ value }}
    </span>
    <span v-else>
      <!-- Is an Array of data objects -->
      <span v-for="(v, i) in value" :key="i">
        <span v-if="i > 0">,</span>
        <nuxt-link v-if="objectType !== 'ATT&CK-reference'" :to="v.route">{{ v.name }}</nuxt-link>
      </span>
    </span>
  </div>
</template>
<script>
import { capitalizeSidebar } from '~/assets/tools.js'
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
      const pluralTitle = capitalizeSidebar(plural, ' ')

      if (this.isStringProperty || this.relatedObjs.length === 1 || !Array.isArray(this.relatedObjs)) {
        // String property or singular item in list (if key happens to be singular)
        // Capitalize the space-separated title, no auto-pluralization
        return capitalizeSidebar(this.objectType, '-')
      } else if (this.doShowInfo) {
        // Capitalize the plural version of the title
        return pluralTitle
      } else {
        // Summarize count
        return `Number of ${pluralTitle}`
      }
    },
    value () {
      // Display string property or object links under a certain threshold
      if (this.isStringProperty || this.doShowInfo || !Array.isArray(this.relatedObjs)) {
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
