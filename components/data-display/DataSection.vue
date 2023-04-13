<!-- Collapsable group for related data objects on individual data pages -->
<template>
  <v-list-group
    v-if="items.length && typeof items[0] === 'object'"
    :value="true"
  >
    <template #activator>
      <page-section-title class="text-capitalize">
        {{ title }}
      </page-section-title>
    </template>
    <!-- Use InfoTable if there's columnNames -->
    <info-table
      v-if="
        'columnNames' in items[0] && items[0]['object-type'] != 'case-study'
      "
      class="mx-8"
      :items="items"
    />
    <!-- Else Only show items in array of data objects -->
    <related-objs-list
      v-else
      :parent-object="parentObject"
      :items="items"
      :item-type="itemType"
    />
  </v-list-group>
</template>
<script>
import { mapGetters } from 'vuex'
import { dataObjectToPluralTitle } from '@/assets/dataHelpers.js'

export default {
  name: 'DataSection',
  props: ['parentObject', 'items', 'itemType'],
  computed: {
    ...mapGetters(['getDataObjectById']),
    title () {
      if (Array.isArray(this.items) && this.items.length === 1) {
        // Return what may be a singular version of this title
        return this.itemType.replace('-', ' ')
      }
      return dataObjectToPluralTitle(this.itemType)
    },
    itemsContainsDataObjects () {
      // The first item in the provided list is a data object, assumes same for entire list
      return 'object-type' in this.items[0]
    }
  },
  methods: {}
}
</script>
