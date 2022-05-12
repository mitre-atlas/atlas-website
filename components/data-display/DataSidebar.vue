<!-- Sidebar on individual data pages displaying ID and other summaries -->
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
        v-for="(relatedObjs, objectType) in relatedObjects"
        :key="objectType"
      >
        <span class="font-weight-bold">Number of {{ pluralize(objectType) }}:</span> {{ relatedObjs.length }}
      </p>
    </v-card-text>
  </v-card>
</template>
<script>
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

export default {
  name: 'DataSidebar',
  props: ['dataObject', 'relatedObjects'],
  methods: {
    pluralize (objectType) {
      return dataObjectToPluralTitle(objectType)
    }
  }
}
</script>
