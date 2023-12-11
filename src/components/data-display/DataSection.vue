<!-- Collapsable group for related data objects on individual data pages -->
<template>
    <v-list
      v-if="items.length && typeof items[0] === 'object'"
      :value="true"
    >
      <v-list-item>
        <div class="text-capitalize text-h5" style="text-align: left">
          {{ title }}
        </div>
      </v-list-item>
  
      <!-- TODO for when case studies are implemented: Use InfoTable (not div) if there's columnNames -->
      <!-- <div
        v-if="
          'columnNames' in items[0] && items[0]['object-type'] != 'case-study'
        "
        class="mx-8"
        :items="items"
      > </div> -->
  
      <!-- Else Only show items in array of data objects -->
      <v-list-item>
        <related-objs-list
  
          :parent-object="parentObject"
          :items="items"
          :item-type="itemType"
        />
      </v-list-item>
      </v-list>
  </template>
  <script setup lang="ts">
  import { dataObjectToPluralTitle } from "@/assets/dataHelpers.js";
  import { computed } from 'vue' 
  import RelatedObjsList from './RelatedObjsList.vue'
  
  const { parentObject, items, itemType } = defineProps([
    /**
     * Data object that these items apply to
     * @type {Object}
     */
      'parentObject',
    /**
     * Data objects of itemType related to the parent object
     * @type {Object[]}
     */
    'items',
    /**
     * Data object type or a hyphen-delimited title
     * @type {String}
     */
    'itemType'
    ]);
  
  const title = computed(() => {
    if (Array.isArray(items) && items.length === 1) {
      // Return what may be a singular version of this title
      return itemType.replace('-', ' ')
    }
    return dataObjectToPluralTitle(itemType)
  });
  
  </script>
  