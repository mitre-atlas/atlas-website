<template>
  <div>
    <div>
      <page-title>
        {{ title }}
      </page-title>

      <v-row>
        <v-col cols="8">
          <page-section-title> Summary </page-section-title>
          <v-list-item>
            <!-- eslint-disable vue/no-v-html -->
            <div v-html="$md.render(dataObject.description)" />
          </v-list-item>
        </v-col>

        <v-col cols="4">
          <data-sidebar :data-object="dataObject" />
        </v-col>
      </v-row>

      <data-links
        v-for="(relatedObjs, objectType) in relatedObjects"
        :key="objectType"
        :item-type="objectType"
        :items="relatedObjs"
        :parent-object="dataObject"
      />
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data: ({ $config: { name }, $route: { params } }) => ({
    mitreTitle: name.mitre,
    objectTypePlural: params.objectTypePlural,
    id: params.id
  }),
  layout: 'side-nav',
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  },
  computed: {
    dataObject () {
      return this.$store.getters.getDataObjectById(this.id)
    },
    title () {
      // If it's a technique or subtechnique, use the label property
      if ('label' in this.dataObject) {
        return this.dataObject.label
      }
      // Otherwise use the name
      return this.dataObject.name
    },
    items () {
      return this.$store.getters.getDataObjectsByType(this.objectTypePlural)
    },
    relatedObjects () {
      // Returns the entries of dataObject.relatedObjects that are actual data objects
      // and not string properties that should be displayed as-is
      return Object.fromEntries(
        Object.entries(this.dataObject.relatedObjects).filter(([_, value]) => {
          // Related data objects should be an Array.
          // Value can also be a string, which is filtered out
          return Array.isArray(value) && typeof value !== 'string'
        })
      )
    }
  },
  mounted () {
    this.setNavItems(this.$store.getters.getDataObjectsByType(this.objectTypePlural))
  },
  methods: {
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>
