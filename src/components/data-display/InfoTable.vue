<template>
  <div class="text-left">
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
        v-model:sort-by="sortBy"
        :search="search"
        items-per-page="-1"
      >
      <template #[`header.name`]="{ column, isSorted, getSortIcon }">
        <span>
          {{ column.title }}
          <!-- Display an info tooltip for ATT&CK-adapted objects -->
          <AttackIconTooltip :items="tableItems" />
        </span>
        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)"></v-icon>
      </template>
      <template #[`item.id`]="{ value }">
        <router-link
          :to="`/${objectTypePlural}/${value}`"
        >
        {{ value }}
        </router-link>
      </template>
      <template #[`item.name`]="{ item, value }">
        <router-link
          :to="`/${objectTypePlural}/${item.id}`"
        >
        {{ value }}
        </router-link>
        <span v-if="'ATT&CK-reference' in item" class="attack-and">&</span>
      </template>
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
import AttackIconTooltip from '@/components/AttackIconToolTip.vue'

const mainStore = useMain()


 const { objectTypePlural } = defineProps([
    /**
     * Data object type (e.g. tactics)
     * @type {String}
     */
    'objectTypePlural',
  ]);


  const tableItems = computed(() => {

    // Get case study objects if needed (store has it with the hyphen)
    if (objectTypePlural == "studies") {
      return mainStore.getDataObjectsByType('case-studies')
    }

    return mainStore.getDataObjectsByType(objectTypePlural)
  })

  const headers =  [
    { title: 'ID', key: 'id', align: 'end' },
    { title: 'Name', key: 'name', align: 'start' },
    { 
      title: objectTypePlural === 'studies' ? 'Summary' : 'Description', 
      key: objectTypePlural === 'studies' ? 'summary' : 'description', 
      align: 'start' 
    },
  ]
  // default sort by id for studies only
  const sortBy = objectTypePlural === 'studies' ? [{ key: 'id', order: 'desc' }] : []
  const search = ref('')

</script>

<style scoped>
</style>
