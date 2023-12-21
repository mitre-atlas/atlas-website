<template>
  <div class="text-left px-16 mx-16">
    <v-card>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search for Keywords"
          append-inner-icon="mdi-magnify"

          hide-details
        />
      </template>
      <v-data-table 
        :items="tableItems"
        :headers="headers"
        :search="search"
        items-per-page="-1"
      >
      <template v-slot:bottom> </template>
      </v-data-table>
    </v-card>

  </div>
</template>

<script setup>

/**
 * Table containing an organized list of items of one object type.
 */
import { computed, ref } from 'vue' 
import { useMain } from "@/stores/main"
const mainStore = useMain()


 const { objectTypePlural } = defineProps([
    /**
     * Data object type (e.g. tactics)
     * @type {String}
     */
    'objectTypePlural',
  ]);


  const tableItems = computed(() => {
    const obj = mainStore.getDataObjectsByType(objectTypePlural)
    return obj
  })

  const headers =  [
    { title: 'ID', key: 'id', align: 'end' },
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Summary', key: 'description', align: 'start' },
  ]
  const search = ref('')
  console.log('tableItems = ', tableItems)

</script>

<style scoped>
</style>
