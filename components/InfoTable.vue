<template>
  <div>
    <v-row align="center" class="pt-3 pb-3">
      <v-col
        v-if="matrices.length > 1"
        :cols="$vuetify.breakpoint.mobile ? 6 : auto"
      >
        <list-filter
          :filter-options="matrices"
          filter-type="matrix"
          @selectedFilters="updateFilteredItems"
        />
      </v-col>
      <v-col
        :cols="$vuetify.breakpoint.mobile ? 12 : auto"
      >
        <v-text-field
          v-if="includeSearch"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search for keywords"
        />
        <v-row v-else no-gutters>
          <v-spacer />
          <v-col>
            <v-text-field
              v-if="extendSearch"
              v-model="search"
              dense
              label="Search for keywords"
            />
          </v-col>
          <v-col sm="1">
            <v-btn
              text
              :outlined="extendSearch === false ? true : false"
              @click="toggleSearch"
            >
              <v-icon>mdi-magnify</v-icon>
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        v-if="categories.length > 1"
        :cols="$vuetify.breakpoint.mobile ? 6 : auto"
      >
        <list-filter
          :filter-options="categories"
          filter-type="category"
          tooltip-path="descriptions/categories"
          @selectedFilters="updateFilteredItems"
        />
      </v-col>
      <v-col
        v-if="lifecycleStages.length > 1"
        :cols="$vuetify.breakpoint.mobile ? 6 : auto"
      >
        <list-filter
          :filter-options="lifecycleStages"
          tooltip-path="descriptions/ML-lifecycle"
          filter-type="ML lifecycle stage"
          @selectedFilters="updateFilteredItems"
          :matchTooltipOrder="true"
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredTableItems"
      :search="search"
      :options="options"
      hide-default-footer
      disable-pagination
      class="row-height"
    >
      <template #[`header.name`]="{ header }">
        <span>
          {{ header.text }}
          <!-- Display an info tooltip for ATT&CK-adapted objects -->
          <attack-icon-tooltip :items="tableItems" />
        </span>
      </template>
      <template #[`item.id`]="{ item }">
        <nuxt-link :id="item.id" :to="item.route">
          <span v-if="'subtechnique-of' in item">
            <!-- Display full ID for subtechniques -->
            {{ item.id }}
          </span>
          <span v-else>
            {{ item.id }}
          </span>
        </nuxt-link>
      </template>
      <template #[`item.name`]="{ item }">
        <nuxt-link :to="item.route">
          <span v-if="'label' in item">{{ item.label }}</span>
          <span v-else>
            {{ item.name }}
          </span>
        </nuxt-link>
        <span v-if="'ATT&CK-reference' in item" class="attack-and">&</span>
      </template>
      <!-- Dynamically render all custom columns with Markdown -->
      <template
        v-for="colName in customTableCol"
        #[`item.${colName}`]="{ item }"
      >
        <div
          :key="colName"
          class="tw-prose max-w-none"
          style="font-size: 0.875rem"
          v-html="$md.render(item[colName])"
        />
      </template>
    </v-data-table>

    <scroll-to-top-button />
  </div>
</template>

<script>
import { capitalize } from '~/assets/tools.js'

/**
 * Table containing an organized list of items of one object type.
 * @see {pages/_objectTypePlural/index.vue} where InfoTable is used.
 * @see {pages/studies/index.vue} where InfoTable is used.
 */
export default {
  name: 'InfoTable',
  props: {
    /**
     * Object or array of items to be rendered in the info table
     * @type {Array|Object}
     */
    items: {
      type: [Array, Object],
      default: () => {
        return []
      }
    },
    /**
     * Vuetify data table options for sorts, etc.
     * @link https://v2.vuetifyjs.com/en/api/v-data-table/#props-options
     */
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      /**
       * Text to filter on the info table.
       * @type {String}
       */
      search: '',
      searchCategories: '',
      searchLifecycle: '',
      /**
       * All items that can be passed into the info table.
       * @type {Object}
       */
      tableItems: this.initializeTableItems(this.items),
      /**
       * Items to be passed into the info table after being filtered
       * @type {Object}
       */
      filteredTableItems: this.initializeTableItems(this.items),
      /**
       * Whether to expand the search toolbar
       * @type {Boolean}
       */
      extendSearch: false,
      /**
       * Holds all filter types and their current selected options
       * @type {Array}
       */
      filterData: []
    }
  },
  computed: {
    /**
     * Collect all possible categories (all categories to include in the filter)
     * @returns {String[]}
     */
    categories () {
      return this.tableItems.reduce((categoryArr, dataObj) => {
        if ('category' in dataObj) {
          dataObj.category.forEach((category) => {
            if (!categoryArr.includes(category)) {
              categoryArr.push(category)
            }
          })
        }
        return categoryArr
      }, [])
    },

    /**
     * Collect all possible ML Lifecycle stages (all ML Lifecycle stages to include in the filter)
     * @returns {String[]}
     */
    lifecycleStages () {
      return this.tableItems.reduce((lifecycleArr, dataObj) => {
        if ('ML-lifecycle' in dataObj) {
          dataObj['ML-lifecycle'].forEach((stage) => {
            if (!lifecycleArr.includes(stage)) {
              lifecycleArr.push(stage)
            }
          })
        }
        return lifecycleArr
      }, [])
    },

    /**
     * Shows the search toolbar when the content is not mitigation's technique use
     * @type {Boolean}
     */
    includeSearch () {
      if (this.tableItems[0].columnNames) {
        return this.tableItems[0].columnNames[0] !== 'use'
      }
      return true
    },

    /**
     * Returns the array of column/field names to use in the table, which always has 'id' and 'name'.
     * Defaults to 'description'.
     * @type {String[]}
     */
    customTableCol () {
      return 'columnNames' in this.tableItems[0]
        ? this.tableItems[0].columnNames
        : ['description']
    },

    /**
     * Get all matrices in the data for the user to filter on
     * @returns {Array}
     */
    matrices () {
      return this.$store.getters.getMatrixIds
    },

    /**
     * The headers for the info table
     * @returns {Object}
     */
    headers () {
      const constantColumns = [
        { value: 'id', text: 'ID', align: 'right', width: '15%' },
        { value: 'name', text: 'Name', width: '25%' }
      ]

      const col3 = this.customTableCol.map((columnName) => {
        return {
          value: columnName,
          text: capitalize(columnName),
          sortable: false
        }
      })

      const combinedConstColumns = constantColumns.concat(col3)
      return combinedConstColumns
    }

  },
  methods: {
    /**
     * Update the filteredTable items so that the newly filtered results can be displayed in the table
     * @param {Object} selectedFilters
     */
    updateFilteredItems (selectedFilters) {
      this.filteredTableItems = this.tableItems // Refresh filteredTableItems so it contains all items

      const filterType = selectedFilters.filterType // Collect filterType ('matrix', 'category', etc) from emitted data
      const filters = selectedFilters.selectedOptions // Collect user-selected filters from emitted data

      this.filterData[filterType] = filters // Update filterData with the newly selected filters

      // Loop through all filterData by filterTyoe ('matrix', 'category', etc) to filter by each category
      for (const filterType in this.filterData) {
        this.filterByType(filterType)
      }
    },
    /**
     * Filter by the given category (filterType) appropriately
     * @param {String} filterType
     */
    filterByType (filterType) {
      switch (filterType) {
        case 'matrix':
          this.filteredTableItems = this.filterMatrix()
          break
        case 'ML lifecycle stage':
          this.filteredTableItems = this.filterLifecycle()
          break
        case 'category':
          this.filteredTableItems = this.filterCategory()
          break
        default:
          // Default filtering logic
          this.filteredTableItems = this.tableItems.filter(tableItem =>
            this.selectedFilters.includes(tableItem)
          )
      }
    },
    /**
     * Filter the results to be displayed in the table based on matrix
     * @returns {Array}
     */
    filterMatrix () {
      // Verify that there are matrix filters to filter on
      if (!('matrix' in this.filterData)) {
        return this.filteredTableItems
      }

      return this.filteredTableItems.filter(tableItem =>
        this.filterData.matrix.includes(tableItem.matrixId)
      )
    },
    /**
     * Filter the results to be displayed in the table based on category
     * @returns {Array}
     */
    filterCategory () {
      // Verify that there are category filters selected to filter on
      if (!('category' in this.filterData) || this.filterData.category.length < 1) {
        return this.filteredTableItems
      }

      // Filter any item that doesn't contain all of the appropriate category(s)
      return this.filteredTableItems.filter((tableItem) => {
        return this.filterData.category.every((filteredCategory) => {
          if ('category' in tableItem) {
            return tableItem.category.includes(filteredCategory)
          }
          return false
        })
      })
    },
    /**
     * Filter the results to be displayed in the table based on ML lifecycle stage
     * @returns {Array}
     */
    filterLifecycle () {
      // Verify that there are ML lifecycle stage filters selected to filter on
      if (!('ML lifecycle stage' in this.filterData) || this.filterData['ML lifecycle stage'].length < 1) {
        return this.filteredTableItems
      }

      // Filter any item that doesn't contain all of the appropriate lifecycle stage(s)
      return this.filteredTableItems.filter((tableItem) => {
        return this.filterData['ML lifecycle stage'].every((filteredCategory) => {
          if ('ML-lifecycle' in tableItem) {
            return tableItem['ML-lifecycle'].includes(filteredCategory)
          }
          return false
        })
      })
    },
    /**
     * Called when the search toolbar is expanded or hidden.
     * Clears any search parameters as needed.
     */
    toggleSearch () {
      this.extendSearch = !this.extendSearch
      this.search = ''
    },

    /**
     * Set the initial set of data table items from the items prop
     * @param {Object} items
     * @returns {Object}
     */
    initializeTableItems (items) {
      // Pass through any arrays of data objects, i.e. non-matrix objects like case studies
      if (Array.isArray(items)) {
        return items
      }

      // Otherwise, items is an object where keys are matrix IDs and values are data objects
      for (const [matrixId, dataObjs] of Object.entries(items)) {
        // Add the matrix ID as an attribute of each data object
        dataObjs.forEach(dataObj => (dataObj.matrixId = matrixId))
      }

      // Return the list of augmented data objects
      return Object.values(items).flat()
    }
  }
}
</script>
<style scoped>
::v-deep .v-chip__content {
  display: inline-block !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 5px;
}
::v-deep .v-data-table.row-height td {
  padding: 2%;
}
</style>
