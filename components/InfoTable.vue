<template>
  <div>
    <v-row align="center" class="pt-3 pb-3">
      <v-col v-if="matrices.length !== 1 && !isCaseStudy" :cols="4">
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
          v-model="search"
          append-icon="mdi-magnify"
          label="Search for keywords"
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredTableItems"
      :search="search"
      hide-default-footer
      disable-pagination
    >
      <template #[`item.id`]="{ item }">
        <nuxt-link :id="item.id" :to="item.route">
          <span v-if="'subtechnique-of' in item">
            <!-- Display only last numeric portion of ID for subtechniques -->
            {{ item.id.substring(item.id.lastIndexOf('.')) }}
          </span>
          <span v-else>
            {{ item.id }}
          </span>
        </nuxt-link>
      </template>
      <template #[`item.name`]="{ item }">
        <nuxt-link :to="item.route">
          {{ item.name }}
        </nuxt-link>
      </template>
      <template #[`item.description`]="{ item }">
        <div
          v-if="isCaseStudy"
          class="my-3"
          v-html="$md.render(item.summary)"
        />
        <div v-else class="my-3" v-html="$md.render(item.description)" />
      </template>
    </v-data-table>

    <scroll-to-top-button />
  </div>
</template>

<script>
export default {
  name: 'InfoTable',
  props: ['items', 'isCaseStudy'],
  data () {
    return {
      search: '',
      filterMatrices: [],
      tableItems: this.initializeTableItems(this.items)
    }
  },
  computed: {
    filteredTableItems () {
      // Change the data table items based on matrix filters

      // Pass through for non-matrix items, ex. case studies
      if (this.isCaseStudy) {
        return this.tableItems
      }
      // Only include data objects with selected matrix IDs
      const filteredItems = this.tableItems.filter(obj =>
        this.filterMatrices.includes(obj.matrixId)
      )
      return filteredItems
    },
    matrices () {
      return this.$store.getters.getMatrixIds
    },
    headers () {
      return [
        {
          value: 'id',
          text: 'ID',
          align: 'right',
          width: '15%'
        },
        { value: 'name', text: 'Name', width: '25%' },
        { value: 'description', text: 'Description', sortable: false }
      ]
    },
    selectAll () {
      return this.filterMatrices.length === this.matrices.length
    },
    icon () {
      if (this.selectAll) {
        return 'mdi-close-box'
      }
      return 'mdi-checkbox-blank-outline'
    }
  },
  mounted () {
    this.toggle()
  },
  methods: {
    toggle () {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.filterMatrices = []
        } else {
          this.filterMatrices = this.matrices.slice()
        }
      })
    },
    initializeTableItems (items) {
      // Set the initial set of data table items from the items prop

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
</style>
