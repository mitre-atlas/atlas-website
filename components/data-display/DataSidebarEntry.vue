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
        <nuxt-link :to="v.route">{{v.name}}</nuxt-link>
      </span>
    </span>
  </div>
</template>
<script>
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
    doShowInfo () {
      // Display string properties or object links, max of a certain number
      return typeof this.relatedObjs === 'string' || this.relatedObjs.length <= this.maxNumDisplay
    },
    key () {
      // Header
      const plural = dataObjectToPluralTitle(this.objectType)

      if (this.doShowInfo) {
        // Capitalize title
        return `${plural[0].toUpperCase()}${plural.slice(1)}`
      } else {
        // Summarize count
        return `Number of ${plural}`
      }
    },
    value () {
      // Display string property or object links under a certain threshold
      if (this.doShowInfo) {
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
