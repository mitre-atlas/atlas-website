<template>
  <v-list v-model:opened="titleGroup">
    <v-list-group :value="title">
      <template v-slot:activator="{ props }">
        <v-row no-gutters>
          <v-col cols="auto">
            <v-list-item class="text-capitalize text-h5" v-bind="props">
              {{ title }}
            </v-list-item>
          </v-col>
        </v-row>
      </template>

      <!-- Use InfoTable if there's columnNames -->
      <InfoTable
        v-if="'columnNames' in items[0] && items[0]['object-type'] != 'case-study'"
        class="mx-8"
        :items="items"
      />
      <related-objs-list
        v-else
        :parent-object="parentObject"
        :items="items"
        :item-type="itemType"
      />
    </v-list-group>
  </v-list>
</template>

<script setup lang="ts">
import { dataObjectToPluralTitle } from '@/assets/dataHelpers.js'
import { computed, ref } from 'vue'
import RelatedObjsList from './RelatedObjsList.vue'
import InfoTable from '@/components/data-display/InfoTable.vue'

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
])

const title = computed(() => {
  if (Array.isArray(items) && items.length === 1) {
    // Return what may be a singular version of this title
    return itemType.replace('-', ' ')
  }
  return dataObjectToPluralTitle(itemType)
})

const titleGroup = ref([title.value])
</script>
