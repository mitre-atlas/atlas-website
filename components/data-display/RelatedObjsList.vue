<template>
  <hover-preview :data-objects="hoverDataObjects" :is-list-group="true">
    <div v-for="(d, i) in itemsList" :key="i">
      <v-list-item v-if="'route' in d" :nuxt="true" :to="d.route">
        <v-list-item>
          <v-list-item-title>
            {{ getLabelById(d.id) || d.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item>
    </div>
  </hover-preview>
</template>

<script>
import { mapGetters } from 'vuex'
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

/**
 * Collapsable item list for related data objects on individual data pages
 */
export default {
  name: 'RelatedObjsList',
  props: [
    /**
     * Data object that these items apply to
     * @type {Object}
     */
    'parentObject',
    /**
     * Data objects of itemType related to the parent object
     * @type {Object[]}
     */
    'items',
    /**
     * Data object type or a hyphen-delimited title
     * @todo LW Revisit the hyphen-delimited title idea
     * @type {String}
     */
    'itemType'
  ],
  computed: {
    ...mapGetters(['getDataObjectById']),
    /**
     * Title for the collapsable list - either the provided itemType
     * or a plural version of the data object type in itemType
     * @todo LW Is the itemType as non-object-type used? How so?
     * @type {String}
     */
    title () {
      if (Array.isArray(this.itemsList) && this.itemsList.length === 1) {
        // Return what may be a singular version of this title
        return this.itemType.replace('-', ' ')
      }
      return dataObjectToPluralTitle(this.itemType)
    },
    /**
     * Items sorted by ID in alphabetical order
     * @type {Object[]}
     */
    itemsList () {
      return [...this.items].sort((a, b) => (a.id > b.id) ? 1 : -1)
    },
    /**
     * Converts each case study item into a HoverPreview-friendly format,
     * pulling out the relevant procedure step description that features the parent object.
     * Passes through all other objects.
     * @type {Object[]}
     */
    hoverDataObjects () { // Modifies the data objects passed into the preview if necessary
      if (this.itemType === 'case-study') { // If a case study, process the object given to hover-preview
        const hoverItems = []
        this.itemsList.forEach((caseStudy) => { // outer loop
          caseStudy.procedure.every((step) => { // inner loop
            if (this.parentObject['object-type'] === 'tactic') {
              // Related case study step to a tactic
              if (step.tactic === this.parentObject.id) {
                // match the first step that uses that tactic
                hoverItems.push({
                  id: caseStudy.id,
                  name: caseStudy.name,
                  'object-type': caseStudy['object-type'].replace('-', ' '),
                  description: step.description,
                  route: caseStudy.route
                })
                return false // eg break out of inner loop
              }
            } else if (this.parentObject['object-type'] === 'technique') {
              // Related case study step to a technique
              // match the first step that uses that technique
              if (step.technique === this.parentObject.id) {
                hoverItems.push({
                  id: caseStudy.id,
                  name: caseStudy.name,
                  'object-type': caseStudy['object-type'].replace('-', ' '),
                  description: step.description,
                  route: caseStudy.route
                })
                return false // eg break out of inner loop
              }
            }
            return true // keep searching for match
          })
        })
        return hoverItems
      } else { // Otherwise just return the items
        return this.itemsList
      }
    }
  },
  methods: {
    /**
     * Returns the `label` of the specified object ID
     * @todo LW Is `label` available in the related objs info? Why query?
     * @param {String} id - Data object ID
     */
    getLabelById (id) {
      return this.getDataObjectById(id).label
    }
  }
}
</script>
