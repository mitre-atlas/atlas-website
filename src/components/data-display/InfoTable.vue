<template>
  <div>
    <v-row class="mb-3" v-if="userInput">
      <v-col :cols="smAndDown ? 12 : ''">
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
            <v-btn :variant="extendSearch === false ? 'outlined' : 'text'" @click="toggleSearch">
              <v-icon>mdi-magnify</v-icon>
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="categories.length > 0" :cols="smAndDown ? 6 : ''">
        <TableFilter :categories="categories" @updateFilters="updateFilters" />
      </v-col>
      <v-col v-if="stages.length > 0" :cols="smAndDown ? 6 : ''">
        <TableFilter :stages="stages" @updateFilters="updateFilters" />
      </v-col>
    </v-row>
    <v-data-table
      :items="filteredItems"
      :headers="headers"
      :sortBy="objectTypePlural === 'studies' ? [{ key: 'id', order: 'desc' }] : []"
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
        <router-link :to="item.route">
          {{ value }}
        </router-link>
      </template>
      <template #[`item.name`]="{ item, value }">
        <router-link :to="item.route" class="name-link-with-marker">
          <span v-if="'label' in item">{{ item.label }}</span>
          <span v-else>{{ value }}</span>
          <span v-if="'attack-reference' in item" class="attack-and">&</span>
        </router-link>
      </template>
      <template v-for="col in customTableCol" #[`item.${col}`]="{ value }" :key="col">
        <div
          v-if="typeof value === 'string'"
          v-html="mdAndUp ? md.render(value) : md.render(truncateText(value))"
        />
        <div v-if="typeof value === 'object'">
          <router-link :to="value.route">
            {{ value.name }}
          </router-link>
        </div>
      </template>
      <template v-slot:bottom> </template>
    </v-data-table>
  </div>
</template>

<script setup>
/**
 * Table containing an organized list of items of one object type.
 */
import { computed, inject, ref, reactive } from 'vue'
import AttackIconTooltip from '@/components/AttackIconToolTip.vue'
import TableFilter from './TableFilter.vue'
import { useRoute } from 'vue-router'
import { capitalize, getFirstParagraph } from '@/assets/tools.js'
import { isDataRouteTypeKey } from '@/assets/objectTypes.js'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
const { mdAndUp } = useDisplay()

const md = inject('markdownit')

const route = useRoute()

const { objectTypePlural } = route.params

const { items, itemType } = defineProps([
  /**
   * Data rows for table
   * @type {Array}
   */
  'items',
  /**
   * Data object type or a hyphen-delimited title
   * @type {String}
   */
  'itemType',
])

const filters = reactive({
  categories: [],
  'lifecycle-phases': [],
})

const hasItems = computed(() => Array.isArray(items) && items.length > 0)

const firstItem = computed(() => (hasItems.value ? items[0] : undefined))

const userInput = computed(() => {
  if (itemType == 'mitigation' || itemType == 'procedure_examples' || itemType == 'technique') {
    return false
  }
  return true
})

const filteredItems = computed(() => {
  if (!hasItems.value) {
    return []
  }
  if (filters.categories.length === 0 && filters['lifecycle-phases'].length === 0) {
    return displayItems.value
  }
  return displayItems.value.filter((item) => {
    return (
      filters.categories.every((i) => (item.categories || []).includes(i)) &&
      filters['lifecycle-phases'].every((i) => (item['lifecycle-phases'] || []).includes(i))
    )
  })
})

const shouldUseFirstParagraphDescriptions = computed(() => {
  const routeType = typeof objectTypePlural === 'string' ? objectTypePlural : ''
  return isDataRouteTypeKey(routeType) || (routeType === 'tactics' && itemType === 'technique')
})

const displayItems = computed(() => {
  if (!hasItems.value) {
    return []
  }

  if (!shouldUseFirstParagraphDescriptions.value) {
    return items
  }

  return items.map((item) => {
    if (typeof item.description !== 'string') {
      return item
    }

    return {
      ...item,
      description: getFirstParagraph(item.description),
    }
  })
})

function updateFilters(filterType, filterTerms) {
  filters[filterType] = filterTerms
}

const categories = computed(() => {
  if (!hasItems.value) {
    return []
  }
  return displayItems.value.reduce((categoryArr, dataObj) => {
    if ('categories' in dataObj) {
      dataObj.categories.forEach((category) => {
        if (!categoryArr.includes(category)) {
          categoryArr.push(category)
        }
      })
    }
    return categoryArr
  }, [])
})

const stages = computed(() => {
  if (!hasItems.value) {
    return []
  }
  return displayItems.value.reduce((lifecycleArr, dataObj) => {
    if ('lifecycle-phases' in dataObj) {
      dataObj['lifecycle-phases'].forEach((stage) => {
        if (!lifecycleArr.includes(stage)) {
          lifecycleArr.push(stage)
        }
      })
    }
    return lifecycleArr
  }, [])
})

const headers = computed(() => {
  const output = [
    { title: 'ID', key: 'id', align: mdAndUp.value ? 'start' : ' d-none' },
    { title: 'Name', key: 'name', align: 'start' },
  ]
  const col3 = customTableCol.value.map((columnName) => {
    return {
      value: columnName,
      title: capitalize(columnName),
      sortable: false,
    }
  })
  return output.concat(col3)
})

const customTableCol = computed(() => {
  if (!firstItem.value || typeof firstItem.value !== 'object') {
    return ['description']
  }
  return 'columnNames' in firstItem.value ? firstItem.value.columnNames : ['description']
})

const search = ref('')

const includeSearch = computed(() => {
  if (!firstItem.value || typeof firstItem.value !== 'object') {
    return true
  }
  if (firstItem.value.columnNames) {
    return firstItem.value.columnNames[0] !== 'use'
  }
  return true
})

const extendSearch = ref(false)

function toggleSearch() {
  extendSearch.value = !extendSearch.value
  search.value = ''
}

// Cut the displayed text down to at most 150 chars for mobile
function truncateText(text) {
  return text.length > 150 ? text.substring(0, 150) + '...' : text
}
</script>

<style scoped>
.name-link-with-marker .attack-and {
  display: inline-block;
  margin-left: 2px;
  white-space: nowrap;
}
</style>
