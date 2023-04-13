<template>
  <v-card
    flat
    class="mt-10"
  >
    <v-card-text>
      <p>
        <span class="font-weight-bold">ID:</span> {{ dataObject.id }}
      </p>
      <p
        v-for="(relatedObjs, objectType) in dataObject.relatedObjects"
        :key="objectType"
      >
        <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" />
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

/**
 * Sidebar on the right side of individual data pages displaying ID and other summaries
 */
export default {
  name: 'DataSidebar',
  props: [
    /**
     * Displays info of this data object
     * @type {Object}
     */
    'dataObject'
  ],
  methods: {
    /**
     * Returns the pluralized version of this data object type
     * @param {String} objectType
     * @return {String}
     */
    pluralize (objectType) {
      return dataObjectToPluralTitle(objectType)
    }
  }
}
</script>
