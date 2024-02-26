<template>
    <div class="pb-2">
      <span v-if="doShowKey" class="font-weight-bold">{{ key }}: </span>
  
      <!-- Link to ATT&CK -->
      <a v-if="objectType === 'ATT&CK-reference'" :href="relatedObjs.url" target="_blank">
        {{ relatedObjs.id }}
      <v-icon x-small> mdi-open-in-new </v-icon>
      </a>
  
      <!-- Display strings or numbers as-is -->
      <span v-else-if="isValuePrimitive">
        {{ value }}
      </span>
  
      <!-- Link to data objects -->
      <span v-else-if="isThisObjectArray">
        <span v-for="(v, i) in value" :key="i">
  
          <!-- Comma-separated -->
          <span v-if="i > 0">,</span>
          <!-- Display link with full label as text if available -->
          <router-link :to="v.route">
  
            <span v-if="'label' in v">
              {{ v.label }}
            </span>
            <span v-else>
              {{ v.name }}
            </span>
          </router-link>
        </span>
      </span>
  
      <span v-else-if="isStringArray">
        <!-- Sort in alphabetical order -->
        <Tag :tags="value.sort()" />
      </span>
  
      <!-- Otherwise, is tabular format - do not render as data side entry but rather in page contents -->
    </div>
  </template>
  
  <script setup lang="ts">
  /**
   * Displays counts of or short lists of links of related objects, or primitive properties
   * on the right-hand sidebar of individual data pages
   * @see {DataSidebar.vue} for the wrapper
   */
  import { capitalizeSidebar } from '@/assets/tools.js'
  
  import Tag from '@/components/data-display/Tag.vue';
  
  import {
    dataObjectToPluralTitle,
    isDataObjectArray,
    isJavascriptObject
  } from '@/assets/dataHelpers.js'
  
  import { computed } from 'vue' 
  
  const { objectType, relatedObjs } = defineProps([
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
    ]);
  
  const pluralize = (objectType: String) => {
    return dataObjectToPluralTitle(objectType);
  };
  
  // Threshold for how many individual values to display before summarizing counts
  const maxNumDisplay = 3 
  
  /**
   * Whether to show indivdual values or summarize counts
   * @type {Boolean}
   */
  let doShowDataObjLinks = computed(() => {
    // Display items if the number of data objects fall below the defined threshold
    return (
      isThisObjectArray && relatedObjs.length <= maxNumDisplay
    )
  })
  
  /**
   * The key to display as a title
   * @type {String}
   */
  let key = computed(() => {
    // Header
    if(objectType === 'ATT&CK-reference') return 'ATT&CK-reference'

    const plural = dataObjectToPluralTitle(objectType)
    const pluralTitle = capitalizeSidebar(plural, ' ')
    
    if (isThisObjectArray && !doShowDataObjLinks.value) {
      // Summarize count
      
      return `Number of ${pluralTitle}`
    } else if (isThisObjectArray && relatedObjs.length > 1) {
      // Multiple data objects
      return pluralTitle
    }
  
    // String property or singular item in list (if key happens to be singular)
    // Capitalize the space-separated title, no auto-pluralization
    return capitalizeSidebar(objectType, '-')
  })
  
  /**
   * The value to display, either the values themselves, or a summarizing count
   * @type {Object[] or String or Number}
   */
  let value = computed(() => {
    if (isThisObjectArray && !doShowDataObjLinks.value) {
      // Summarize count for data objects over the display threshold
      return relatedObjs.length
    }
  
    // Otherwise use as-is
    return relatedObjs
  })
  
  /**
   * Whether the value is a string or a number
   * @type {Boolean}
   */
  let isValuePrimitive = computed(() => {
    const t = typeof value.value
    return t === 'string' || t === 'number'
  })
  
  /**
   * Whether the relatedObjs is an array of data objects
   * @type {Boolean}
   */
  let isThisObjectArray = computed(() => {
    return isDataObjectArray(relatedObjs)
  })
  
  /**
   * Whether the relatedObjs is an array of strings
   * @type {Boolean}
   */
  let isStringArray = computed(() => {
    return (
      Array.isArray(relatedObjs) &&
      relatedObjs.every(o => typeof o === 'string')
    )
  })
  
  /**
   * Whether to display the key label
   * @type {Boolean}
   */
  let doShowKey = computed(() => {
    return (
      // Same conditions as the template rendering,
      // i.e. render key if value will also render
      objectType === 'ATT&CK-reference' ||
      isValuePrimitive.value ||
      isThisObjectArray.value ||
      isStringArray.value ||  
      // Don't render mitigation uses
      (isJavascriptObject(relatedObjs[0]) &&
        !('use' in relatedObjs[0]))
    )
  })
  
  </script>
  