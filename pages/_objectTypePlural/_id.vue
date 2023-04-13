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
            <div class="tw-prose" v-html="$md.render(dataObject.description)" />
          </v-list-item>
        </v-col>

        <v-col cols="4">
          <data-sidebar :data-object="dataObject" />
        </v-col>
      </v-row>

      <data-section
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
/**
 * @name \_objectTypePlural/\_id
 *
 * Template for each _objectTypePlural
 *
 * An _id page is created for every value that falls under the given object type
 * (tactic/techniques/mitigations/case studies). These pages decribe the object and
 * it's associated information.
 */
export default {
  layout: 'side-nav',
  validate ({ params, store }) {
    // Ensure that ID is valid
    return store.getters
      .getDataObjectsByType(params.objectTypePlural)
      .map(o => o.id)
      .includes(params.id)
  },
  data: ({ $config: { name }, $route: { params } }) => ({
    /**
     * MITRE ATLAS (TM) title
     * @type {String}
     */
    mitreTitle: name.mitre,
    /**
     * This page's object type from ATLAS matrix
     * @type {String}
     */
    objectTypePlural: params.objectTypePlural,
    /**
     * The id of this page's object
     * @type {String}
     */
    id: params.id
  }),
  head () {
    return {
      /**
       * The title of this object type's page
       * @type {String}
       */
      title: `${this.title} | ${this.mitreTitle}`
    }
  },
  computed: {
    /**
     * Gets the data object's info to populate the page.
     * @returns {Object}
     */
    dataObject () {
      return this.$store.getters.getDataObjectById(this.id)
    },
    /**
     * The data object's name or label to title the page.
     * @returns {String}
     */
    title () {
      // If it's a technique or subtechnique, use the label property
      if ('label' in this.dataObject) {
        return this.dataObject.label
      }
      // Otherwise use the name
      return this.dataObject.name
    },
    /**
     * Finds objects related to the page's data object to display to the user.
     * @returns {Object}
     */
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
    // Set the items to appear in the side nav based on which object's page this is
    this.setNavItems(
      this.$store.getters.getDataObjectsByType(this.objectTypePlural)
    )
  },
  methods: {
    // Use SET_NAV_DRAWER_ITEMS mutation to commit what items will appear in the side nav
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>
