<template>
  <v-select
    v-if="filterOptions.length > 0"
    v-model="selectedOptions"
    :label="filterLabel"
    multiple
    small-chips
    :items="dropdownOptions"
    :active="false"
    @input="onDropdownChange"
  >
    <!-- First option in dropdown -->
    <template #prepend-item>
      <div style="padding:0px">
        <v-btn
          value="rounded-0"
          variant="plain"
          color="transparent"
          :elevation="0"
          style=" display: table; height:100%; width:100%; margin: 0px; text-transform: unset !important;"
          class="flex v-list-item--link theme--light"
          @click="prependAction"
        >
          <v-list-item-action>
            <v-icon>
              {{ prependedIcon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="font-weight-regular text-subtitle-1" style="letter-spacing: normal;">
            {{ prependedMsg }}
          </v-list-item-content>
        </v-btn>
      </div>
    </template>

    <!-- Row in the select dropdown -->
    <template #item="data">
      <!-- Render version with tooltip if applicable -->
      <v-tooltip v-if="tooltipPath.length > 1 && getItemDescription(data.item) != 'Definition not found'" top>
        <template #activator="{ on, attrs }">
          <v-layout wrap v-bind="attrs" v-on="on">
            <v-list-item-action>
              <v-checkbox v-model="data.attrs.inputValue" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ data.item }}</v-list-item-title>
            </v-list-item-content>
          </v-layout>
        </template>
        <span>{{ getItemDescription(data.item) }}</span>
      </v-tooltip>

      <!-- No-tooltip option -->
      <v-layout v-else wrap v-bind="attrs" v-on="on">
        <v-list-item-action>
          <v-checkbox v-model="data.attrs.inputValue" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ data.item }}</v-list-item-title>
        </v-list-item-content>
      </v-layout>
    </template>

    <!-- Small card in filter bar -->
    <template #selection="{ item, index }">
      <div class="text-center">
        <v-chip v-if="index < 2" small>
          {{ item }}
        </v-chip>
      </div>
      <span
        v-if="index === 2"
        class="text-grey text-caption align-self-center"
      >
        +{{ selectedOptions.length - 2 }} others
      </span>
    </template>
  </v-select>
</template>

<script>

/**
 * Filter used to filter through the items in InfoTable--passes parameters to filter on (e.g. user-selected categories) to InfoTable
 * @see {components/InfoTable.vue} where ListFilter is used.
 */
export default {
  name: 'ListFilter',
  props: {
    /**
     * Object or array of all possible options the user can filter on
     * @type {Array|Object}
     */
    filterOptions: {
      type: [Array],
      default: () => []
    },
    /**
     * String representing category to be filtered on (matrix, category, etc)
     * @type {String}
     */
    filterType: {
      type: String,
      default: ''
    },
    /**
     * OPTIONAL Path to the yaml file with descriptions for dropdown items
     * @type {String}
     */
    tooltipPath: {
      type: String,
      default: ''
    },
    /**
     * OPTIONAL Whether to sort the filter options by the order they are defined in the tooltipPath
     */
    matchTooltipOrder: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      /**
       * Object or array of items to be displayed in the filter dropdown
       * @type {Array|Object}
       */
      dropdownOptions: this.filterOptions,
      /**
       * Text to be displayed in the first option in the dropdown ("Select all", "Clear all", etc.)
       * @type {String}
       */
      prependedMsg: '',
      /**
       * String representing the mdi-icon in the first option in the dropdown
       * @type {String}
       */
      prependedIcon: '',
      /**
       * Text to filter on the info table.
       * @type {String}
       */
      tableItems: this.unfilteredItems,
      /**
       * Array of objects that are CURRENT SELECTED in the filter dropdown
       * @type {Array|Object}
       */
      selectedOptions: []
    }
  },
  async fetch () {
    // Retrieve filter item descriptions (if exist)
    if (this.tooltipPath.length > 1) {
      const termsContent = await this.$content(this.tooltipPath).fetch()
      const yamlWrapperTitle = Object.keys(termsContent)[1] // Get name of first key in "YAML" object
      this.terms = termsContent[yamlWrapperTitle]

      // Sort the dropdown options in the order they are defined in the tooltip file
      if (this.matchTooltipOrder) {
        const orderedTagNames = this.terms.map(t => t.name)

        this.dropdownOptions.sort((a, b) => {
          if (orderedTagNames.indexOf(a) > orderedTagNames.indexOf(b)) {
            return 1
          } else {
            return -1
          }
        })
      }
    }
  },
  computed: {
    /**
     * Label to display on filter
     * @returns {String[]}
     */
    filterLabel () {
      const label = 'Filter by ' + this.filterType
      return label
    }
  },
  mounted () {
    // On load, make sure correct options are selected/deselected
    this.prependAction()
  },
  methods: {
    /**
     * Update dropdown status and send selected options to parent
     */
    onDropdownChange () {
      this.updateSelectAllIcon()
      // Emit the selected filters (along with the filter type) to the parent
      this.$emit('selectedFilters', {
        filterType: this.filterType,
        selectedOptions: this.selectedOptions
      })
    },
    /**
     * Checks the correct state of the select all based on whether every option has been selected
     */
    updateSelectAllIcon () {
      if (this.prependedMsg !== 'Select All') {
        return
      }

      if (this.selectedOptions.length === this.dropdownOptions.length) {
        this.prependedIcon = 'mdi-close-box'
      } else {
        this.prependedIcon = 'mdi-checkbox-blank-outline'
      }
    },
    /**
     * Get tooltip text for a given item in the dropdown
     * @returns {String}
     * @param {String} name
     */
    getItemDescription (name) {
      const matchingTerm = this.terms.find(t => t.name === name)
      if (matchingTerm) {
        return matchingTerm.description
      }

      // Not found
      return 'Definition not found'
    },
    /**
     * Perform the appropriate action of the first item in the dropdown
     */
    prependAction () {
      this.$nextTick(() => {
        switch (this.filterType) {
          case 'matrix':
            this.prependedMsg = 'Select All'
            if (this.selectedOptions.length === this.dropdownOptions.length) {
              this.selectedOptions = []
            } else {
              this.selectedOptions = this.dropdownOptions.slice()
            }
            break
          default: // Functionality for any other filter (category, ML lifecycle stage, etc) is to clear all selected options
            this.prependedMsg = 'Clear All'
            this.prependedIcon = 'mdi-close'
            this.selectedOptions = []
        }
        this.onDropdownChange()
      })
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
