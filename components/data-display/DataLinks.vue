<!-- Collapsable item list for related data objects on individual data pages -->
<template>
  <hover-preview :data-objects="hoverDataObjects" :is-list-group="true">
    <v-list-group :value="true">
      <template #activator>
        <page-section-title class="text-capitalize">
          {{ title }}
        </page-section-title>
      </template>
      <div v-for="(d, i) in itemsList" :key="i">
        <v-list-item :nuxt="true" :to="d.route">
          <v-list-item>
            <v-list-item-title>
              {{ getLabelById(d.id) || d.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item>
      </div>
    </v-list-group>
  </hover-preview>
</template>
<script>
import { mapGetters } from 'vuex'
import { dataObjectToPluralTitle } from '@/assets/dataHelpers.js'

export default {
  name: 'DataLinks',
  props: ['parentObject', 'items', 'itemType'],
  computed: {
    ...mapGetters(['getDataObjectById']),
    title () {
      if (Array.isArray(this.itemsList) && this.itemsList.length === 1) {
        // Return what may be a singular version of this title
        return this.itemType.replace('-', ' ')
      }
      return dataObjectToPluralTitle(this.itemType)
    },
    itemsList () {
      return [...this.items].sort((a, b) => (a.id > b.id) ? 1 : -1)
    },
    hoverDataObjects () { // Modifies the data objects passed into the preview if necessary
      if (this.itemType === 'case-study') { // If a case study, process the object given to hover-preview
        const hoverItems = []
        this.itemsList.forEach((caseStudy) => { // outer loop
          caseStudy.procedure.every((step) => { // inner loop
            if (this.parentObject['object-type'] === 'tactic') {
              if (step.tactic === this.parentObject.id) { // match the first step that uses that tactic
                hoverItems.push({
                  id: caseStudy.id,
                  name: caseStudy.name,
                  'object-type': caseStudy['object-type'].replace('-', ' '),
                  description: step.description,
                  route: caseStudy.route
                })
                return false // eg break out of inner loop
              }
            } else if (this.parentObject['object-type'] === 'technique') { // match the first step that uses that technique
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
    getLabelById (id) {
      return this.getDataObjectById(id).label
    }
  }
}
</script>
