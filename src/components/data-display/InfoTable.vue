<template>
  <div class="text-left">
    <v-card>
      <template v-slot:text>
        <v-text-field
          v-if="includeSearch"
          v-model="search"
          label="Search for Keywords"
          append-inner-icon="mdi-magnify"
          hide-details
        />
        <v-row v-else no-gutters>
          <v-spacer />
          <v-col>
            <v-text-field
              v-if="extendSearch"
              v-model="search"
              density="compact"
              label="Search for Keywords"
            />
          </v-col>
          <v-col sm="1">
            <v-btn
              :variant="extendSearch === false ? 'outlined' : 'text'"
              @click="toggleSearch"
            >
              <v-icon>mdi-magnify</v-icon>
              Search
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-data-table
        :items="items"
        :headers="headers"
        v-model:sort-by="sortBy"
        :search="search"
        items-per-page="-1"
      >
        <template #[`header.name`]="{ column, isSorted, getSortIcon }">
          <span>
            {{ column.title }}
            <!-- Display an info tooltip for ATT&CK-adapted objects -->
            <AttackIconTooltip :items="items" />
          </span>
          <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)"></v-icon>
        </template>
        <template #[`item.id`]="{ item, value }">
          <router-link
            :to="item.route"
            class="pl-5"
          >
          {{ value }}
          </router-link>
        </template>
        <template #[`item.name`]="{ item, value }">
          <router-link
            :to="item.route"
          >
          {{ value }}
          </router-link>
          <span v-if="'ATT&CK-reference' in item" class="attack-and">&</span>
        </template>
        <template
          v-for="col in customTableCol"
          #[`item.${col}`]="{ value }"
          :key="col"
        >
          <div
            v-html="md.render(value)"
            class="pa-5"
          />
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
import { computed, inject, ref } from 'vue'
import AttackIconTooltip from '@/components/AttackIconToolTip.vue'
import { useRoute } from 'vue-router'
import { capitalize } from '@/assets/tools.js'

import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const md = inject('markdownit')

const route = useRoute()

let { objectTypePlural } = route.params

 const { items } = defineProps([
    /**
     * Data rows for table
     * @type {Array}
     */
    'items',
  ]);


  const headers = computed(() => {
    let output = [
      { title: 'ID', key: 'id', align: 'end' },
      { title: 'Name', key: 'name', align: 'start' },
    ]
    const col3 = customTableCol.value.map((columnName) => {
        return {
          value: columnName,
          title: capitalize(columnName),
          sortable: false
        }
      })
    return output.concat(col3)
  })

  const customTableCol = computed(() => {
    return 'columnNames' in items[0]
      ? items[0].columnNames
      : ['description']
  })

  // default sort by id for studies only
  const sortBy = objectTypePlural === 'studies' ? [{ key: 'id', order: 'desc' }] : []
  const search = ref('')

  const includeSearch = computed(() => {
    if(items[0].columnNames) {
      return items[0].columnNames[0] !== 'use'
    }
    return true
  })

  let extendSearch = ref(false)

  function toggleSearch() {
    extendSearch.value = !extendSearch.value
    search.value = ''
  }

</script>

<style scoped>
</style>
