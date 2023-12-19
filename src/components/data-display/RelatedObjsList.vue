<template>
    <div v-for="(d, i) in itemsList" :key="i">
      <!-- <template v-if="'route' in d">
        {{ getLabelById(d.id) || d.name }}
      </template> -->
  
    <v-list-item
      v-if="'route' in d"
      :key="getLabelById(d.id) || d.name"
      :href="d.route"
      class="pb-1 pt-1 mb-2 text-left text-body-1"
    >
        <div v-html="getLabelById(d.id) || d.name"></div>
    </v-list-item>
    </div>
  </template>
  
  <script setup>
  
  import { useMain } from "@/stores/main"
  const mainStore = useMain()
  
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
     * @todo LW Revisit the hyphen-delimited title idea
     * @type {String}
     */
    'itemType'
  ]);
  
  
  /**
   * Items sorted by ID in alphabetical order
   * @type {Object[]}
   */
   const itemsList = [items][0].sort((a, b) => (a.id > b.id) ? 1 : -1)
  
  
  /**
   * Returns the `label` of the specified object ID
   * @todo LW Is `label` available in the related objs info? Why query?
   * @param {String} id - Data object ID
   */
  let getLabelById = ((id) => {
      const obj = mainStore.getDataObjectById(id)
      return obj.label
    })
  
  </script>
  