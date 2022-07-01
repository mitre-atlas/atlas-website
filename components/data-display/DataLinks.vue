<!-- Collapsable item list for related data objects on individual data pages -->
<template>
  <hover-preview :data-objects="hoverDataObjects" :is-list-group="true">
    <v-list-group :value="true">
      <template #activator>
        <page-section-title class="text-capitalize">
          {{ title }}
        </page-section-title>
      </template>
      <div v-for="(d, i) in items" :key="i">
        <v-list-item :nuxt="true" :to="d.route">
          <v-list-item>
            <v-list-item-title>
              {{ d.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item>
      </div>
    </v-list-group>
  </hover-preview>
</template>
<script>
import { dataObjectToPluralTitle } from '@/assets/dataHelpers.js'

export default {
  name: 'DataLinks',
  props: ['objectType', 'items', 'procedureStepTechniqueId'],
  computed: {
    title () {
      if (Array.isArray(this.items) && this.items.length === 1) {
        // Return what may be a singular version of this title
        return this.objectType.replace('-', ' ')
      }
      return dataObjectToPluralTitle(this.objectType)
    },
    hoverDataObjects () { // Modifies the data objects passed into the preview if necessary
      if (this.objectType === 'case-study') { // If a case study, process the object given to hover-preview
        const hoverItems = []
        this.items.forEach((caseStudy) => {
          caseStudy.procedure.forEach((step) => {
            if (step.technique === this.procedureStepTechniqueId) {
              hoverItems.push({
                id: caseStudy.id,
                name: caseStudy.name,
                'object-type': caseStudy['object-type'].replace('-', ' '),
                description: step.description,
                route: caseStudy.route
              })
            }
          })
        })
        return hoverItems
      } else { // Otherwise just return the items
        return this.items
      }
    }
  }
}
</script>
