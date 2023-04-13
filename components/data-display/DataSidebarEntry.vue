<template>
  <div>
    <span v-if="doShowKey" class="font-weight-bold">{{ key }}:</span>

    <!-- Link to ATT&CK -->
    <sidebar-external-link
      v-if="objectType === 'ATT&CK-reference'"
      :text="relatedObjs.id"
      :url="relatedObjs.url"
    />

    <!-- Display strings or numbers as-is -->
    <span v-else-if="isValuePrimitive">
      {{ value }}
    </span>

    <!-- Link to data objects -->
    <span v-else-if="isDataObjectArray">
      <span v-for="(v, i) in value" :key="i">
        <!-- Comma-separated -->
        <span v-if="i > 0">,</span>
        <!-- Display link with full label as text if available -->
        <nuxt-link :to="v.route">
          <span v-if="'label' in v">
            {{ v.label }}
          </span>
          <span v-else>
            {{ v.name }}
          </span>
        </nuxt-link>
      </span>
    </span>

    <span v-else-if="isStringArray">
      <!-- Sort in alphabetical order -->
      <tag :tags="value" />
    </span>

    <!-- Otherwise, is tabular format - do not render as data side entry but rather in page contents -->
  </div>
</template>
<script>
import { capitalizeSidebar } from '~/assets/tools.js'
import {
  dataObjectToPluralTitle,
  isDataObjectArray,
  isJavascriptObject
} from '~/assets/dataHelpers.js'

/**
 * Displays counts of or short lists of links of related objects, or primitive properties
 * on the right-hand sidebar of individual data pages
 * @see {DataSidebar.vue} for the wrapper
 */
export default {
  name: 'DataSidebarEntry',
  props: [
    /**
     * Data object type for `relatedObjs`, the key
     * @type {String}
     */
    'objectType',
    /**
     * Value of the data object key. which can be an array of data objects,
     * or primitive values
     * @type {Object[] or string}
     */
    'relatedObjs'
  ],
  data () {
    return {
      // Threshold for how many individual values to display before summarizing counts
      maxNumDisplay: 3
    }
  },
  computed: {
    /**
     * Whether the value is a string
     * @type {Boolean}
     */
    isStringProperty () {
      // The value is a string, i.e. this key-value pair is a string property rather than a data object
      return typeof this.relatedObjs === 'string'
    },
    /**
     * Whether to show indivdual values or summarize counts
     * @type {Boolean}
     */
    doShowDataObjLinks () {
      // Display items if the number of data objects fall below the defined threshold
      return (
        this.isDataObjectArray && this.relatedObjs.length <= this.maxNumDisplay
      )
    },
    /**
     * The key to display as a title
     * @type {String}
     */
    key () {
      // Header
      const plural = dataObjectToPluralTitle(this.objectType)
      const pluralTitle = capitalizeSidebar(plural, ' ')

      if (this.isDataObjectArray && !this.doShowDataObjLinks) {
        // Summarize count
        return `Number of ${pluralTitle}`
      } else if (this.isDataObjectArray && this.relatedObjs.length > 1) {
        // Multiple data objects
        return pluralTitle
      }

      // String property or singular item in list (if key happens to be singular)
      // Capitalize the space-separated title, no auto-pluralization
      return capitalizeSidebar(this.objectType, '-')
    },
    /**
     * The value to display, either the values themselves, or a summarizing count
     * @type {Object[] or String or Number}
     */
    value () {
      if (this.isDataObjectArray && !this.doShowDataObjLinks) {
        // Summarize count for data objects over the display threshold
        return this.relatedObjs.length
      }

      // Otherwise use as-is
      return this.relatedObjs
    },
    /**
     * Whether the value is a string or a number
     * @type {Boolean}
     */
    isValuePrimitive () {
      const t = typeof this.value
      return t === 'string' || t === 'number'
    },
    /**
     * Whether the relatedObjs is an array of data objects
     * @type {Boolean}
     */
    isDataObjectArray () {
      return isDataObjectArray(this.relatedObjs)
    },
    /**
     * Whether the relatedObjs is an array of strings
     * @type {Boolean}
     */
    isStringArray () {
      return (
        Array.isArray(this.relatedObjs) &&
        this.relatedObjs.every(o => typeof o === 'string')
      )
    },
    /**
     * Whether to display the key label
     * @type {Boolean}
     */
    doShowKey () {
      return (
        // Same conditions as the template rendering,
        // i.e. render key if value will also render
        this.objectType === 'ATT&CK-reference' ||
        this.isValuePrimitive ||
        this.isDataObjectArray ||
        this.isStringArray ||
        // Don't render mitigation uses
        (isJavascriptObject(this.relatedObjs[0]) &&
          !('use' in this.relatedObjs[0]))
      )
    }
  }
}
</script>
