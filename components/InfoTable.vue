<template>
  <div>
    <v-row align="center" class="pt-3 pb-3">
      <v-col v-if="matrices.length !== 1" :cols="4">
        <v-select
          v-model="filterMatrices"
          label="Filter by matrix"
          multiple
          small-chips
          :items="matrices"
        >
          <template #prepend-item>
            <v-list-item ripple @mousedown.prevent @click="toggle">
              <v-list-item-action>
                <v-icon
                  :color="filterMatrices.length > 0 ? 'indigo darken-4' : ''"
                >
                  {{ icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Select All </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
          </template>
        </v-select>
      </v-col>
      <v-col>
        <v-text-field
          v-if="includeSearch"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search for keywords"
        />
        <v-row v-else no-gutters>
          <v-spacer />
          <v-col sm="6">
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
      /**
       * Array of matrices the user has selected to view and filter on.
       * @type {Array}
       */
      filterMatrices: [],
      /**
       * Items to be passed into the info table.
       * @type {Object}
       */
      tableItems: this.initializeTableItems(this.items),
      /**
       * Whether to expand the search toolbar
       * @type {Boolean}
       */
      extendSearch: false
    }
  },
  computed: {
    /**
     * Change the data table items based on matrix filters
     * @returns {Object}
     */
    filteredTableItems () {
      // Pass through for non-matrix items, ex. case studies
      if (Array.isArray(this.items)) {
        return this.tableItems
      }
      // Only include data objects with selected matrix IDs
      const filteredItems = this.tableItems.filter(obj =>
        this.filterMatrices.includes(obj.matrixId)
      )
      return filteredItems
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
    },
    /**
     * Determines whether or not every matrix has been selected in the dropdown
     * @returns {Boolean}
     */
    selectAll () {
      return this.filterMatrices.length === this.matrices.length
    },
    /**
     * Changes select all box icon based on whether every matrix has been selected
     * @returns {String}
     */
    icon () {
      if (this.selectAll) {
        return 'mdi-close-box'
      }
      return 'mdi-checkbox-blank-outline'
    }
  },
  mounted () {
    // On load, every matrix will automatically be selected
    this.toggle()
  },
  methods: {
    /**
     * Toggles between whether the matrices are all selected or not and sets
     * what filterMatrices contains based on that
     */
    toggle () {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.filterMatrices = []
        } else {
          this.filterMatrices = this.matrices.slice()
        }
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
