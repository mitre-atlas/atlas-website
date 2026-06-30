<template>
  <div v-if="dataObject != undefined">
    <PageSectionTitle :pageTitle="title" />

    <v-row>
      <v-col :cols="mdAndUp ? 9 : 12">
        <TechniqueSubtechniques
          :subtechniques="subtechniquesList"
          :other-subtechniques="otherSubtechniquesList"
          :current-technique="dataObject"
        />
        <v-list-item>
          <div v-html="markdown.render(descriptionWithCitations)" />
        </v-list-item>
        <div v-if="orderedReferences.length > 0" class="ml-4 mt-6">
          <p class="text-h5 mb-3">References</p>
          <div
            v-for="(reference, index) in orderedReferences"
            :key="reference.id || reference.url || index"
            class="mb-2"
          >
            <span>{{ index + 1 }}. </span>
            <a v-if="reference.url" :href="reference.url" target="_blank" rel="noopener noreferrer">
              {{ getReferenceDisplayText(reference) }}
              <v-icon icon="mdi-open-in-new" size="small" />
            </a>
            <span v-else>{{ getReferenceDisplayText(reference) }}</span>
          </div>
        </div>
      </v-col>

      <v-col :cols="mdAndUp ? 3 : 12">
        <DataSidebar :data-object="dataObjectWithRelations" variant="outlined" />
      </v-col>
    </v-row>
    <div v-for="(entry, entryIndex) in orderedObjects" :key="entryIndex">
      <DataSection
        v-for="(relatedObjs, objectType) in entry"
        :key="objectType"
        :itemType="objectType"
        :items="relatedObjs"
        :parentObject="dataObject"
      />
    </div>
  </div>
  <div v-else>
    <!-- Display ErrorNotFound if ID is not found -->
    <ErrorNotFoundView />
  </div>
</template>

<script setup>
import { useMain } from '@/stores/main'
import { useRoute } from 'vue-router'
import { computed, inject } from 'vue'
import DataSection from '@/components/data-display/DataSection.vue'
import DataSidebar from '@/components/data-display/DataSidebar.vue'
import TechniqueSubtechniques from '@/components/data-display/TechniqueSubtechniques.vue'

import PageSectionTitle from '@//components/PageSectionTitle.vue'
import ErrorNotFoundView from './ErrorNotFoundView.vue'
import { stringToSingular } from '@/assets/dataHelpers.js'
import { getReferenceDisplayText, resolveDescriptionCitations } from '@/assets/tools.js'
import { useDisplay } from 'vuetify'

// mobile boolean for contitional rendering
const { mdAndUp } = useDisplay()

const markdown = inject('markdownit')
const mainStore = useMain()

// Collect the plural of the object type (tactics, techniques, etc) and the object ID from the URL
const route = useRoute()
const { id, objectTypePlural } = route.params

// Get the data for this element
const dataObject = computed(() => {
  const obj = mainStore.getDataObjectById(id)

  // Don't set object if the URL's object type is wrong -- should show 404
  if (!obj || obj['object-type'] !== stringToSingular(objectTypePlural)) return undefined

  return mainStore.getDataObjectById(id)
})

const dataObjectWithRelations = computed(() => {
  if (!dataObject.value) {
    return undefined
  }

  if (dataObject.value['object-type'] === 'case-study') {
    return dataObject.value
  }

  return {
    ...dataObject.value,
    relatedObjects: mainStore.getRelatedDataObjects(dataObject.value),
  }
})

const relatedObjects = computed(() => {
  const relatedObjectsArrays = {}
  const source = dataObjectWithRelations.value?.relatedObjects || {}
  Object.keys(source).forEach((key) => {
    if (Array.isArray(source[key]) && typeof source[key][0] !== 'string') {
      relatedObjectsArrays[key] = source[key]
    }
  })
  return relatedObjectsArrays
})

const subtechniquesList = computed(() => {
  return relatedObjects.value.subtechniques || []
})

const otherSubtechniquesList = computed(() => {
  return relatedObjects.value['other subtechniques'] || []
})

const resolvedDescription = computed(() => {
  const description = dataObject.value?.description || ''
  const references = dataObject.value?.references || []
  return resolveDescriptionCitations(description, references)
})

const descriptionWithCitations = computed(() => resolvedDescription.value.description)

const orderedReferences = computed(() => resolvedDescription.value.orderedReferences)

const mappedMitigations = computed(() => {
  if (!relatedObjects.value?.mitigation || !dataObject.value) {
    return undefined
  }

  return relatedObjects.value.mitigation.map((item) => ({
    ...item,
    label: item.name,
    description:
      mainStore
        .getDataObjectById(item.id)
        ?.mitigates?.find((rel) => rel.technique === dataObject.value.id)?.description ||
      item.description,
    columnNames: ['description'],
  }))
})

const mitigationTechniques = computed(() => {
  if (dataObject.value?.['object-type'] !== 'mitigation') {
    return undefined
  }

  const mitigation = mainStore.getDataObjectById(dataObject.value.id)
  const techniques = (mitigation?.mitigates || [])
    .map((rel) => {
      const technique = mainStore.getDataObjectById(rel.technique)
      if (!technique) {
        return null
      }
      return {
        id: technique.id,
        name: technique.name,
        description: rel.description || '',
        route: technique.route,
        'object-type': 'technique',
        ...('attack-reference' in technique
          ? { 'attack-reference': technique['attack-reference'] }
          : {}),
        columnNames: ['description'],
      }
    })
    .filter(Boolean)

  return techniques.length > 0 ? techniques : undefined
})

const procedureExamples = computed(() => {
  if (!relatedObjects.value['case-study'] || dataObject.value?.['object-type'] !== 'technique') {
    return undefined
  }

  const tacticLookup = new Map(
    (relatedObjects.value.tactic || relatedObjects.value.tactics || []).map((tactic) => [
      tactic.id,
      tactic,
    ])
  )

  const procedureExamplesList = []
  relatedObjects.value['case-study'].forEach((caseStudyRef) => {
    const caseStudy = mainStore.getDataObjectById(caseStudyRef.id)
    if (!caseStudy) {
      return
    }

    ;(caseStudy.attack_chain || []).forEach((step) => {
      if (step.technique === dataObject.value.id) {
        const tactic = tacticLookup.get(step.tactic)
        if (!tactic) {
          return
        }

        procedureExamplesList.push({
          id: caseStudy.id,
          name: caseStudy.name,
          actor: caseStudy.actor,
          tactic: {
            name: tactic.name,
            route: tactic.route,
          },
          description: step.description,
          'object-type': 'procedure_examples',
          label: caseStudy.name,
          columnNames: ['actor', 'tactic', 'description'],
          route: caseStudy.route,
        })
      }
    })
  })

  return procedureExamplesList.length > 0 ? procedureExamplesList : undefined
})

const tacticTechniquesTableRows = computed(() => {
  if (dataObject.value?.['object-type'] !== 'tactic' || !relatedObjects.value?.technique) {
    return undefined
  }

  return relatedObjects.value.technique.map((technique) => ({
    ...technique,
    columnNames: ['description'],
  }))
})

const filteredRelatedObjects = computed(() => {
  const ignore = new Set([
    'tactic',
    'tactics',
    'subtechniques',
    'other subtechniques',
    'case-study',
    'parent-technique',
  ])

  const merged = {
    ...relatedObjects.value,
    ...(tacticTechniquesTableRows.value ? { technique: tacticTechniquesTableRows.value } : {}),
    ...(mappedMitigations.value ? { mitigation: mappedMitigations.value } : {}),
    ...(mitigationTechniques.value ? { technique: mitigationTechniques.value } : {}),
    ...(procedureExamples.value ? { procedure_examples: procedureExamples.value } : {}),
  }

  return Object.fromEntries(Object.entries(merged).filter(([key]) => !ignore.has(key)))
})

const orderedObjects = computed(() => {
  const order = ['procedure_examples', 'case-study', 'mitigation', 'technique']
  const orderedObjs = []
  order.forEach((k) => {
    if (Object.keys(filteredRelatedObjects.value).includes(k)) {
      orderedObjs.push({ [k]: filteredRelatedObjects.value[k] })
    }
  })
  Object.keys(filteredRelatedObjects.value).forEach((k) => {
    if (!order.includes(k)) {
      orderedObjs.push({ [k]: filteredRelatedObjects.value[k] })
    }
  })
  return orderedObjs
})

// Page title is the element name
const title = computed(() => {
  // Prepend parent technique name for a subtechnique
  if (dataObject.value && 'subtechnique-of' in dataObject.value) {
    const parentTechnique = mainStore.getParent(dataObject.value)
    return `${parentTechnique.name}: ${dataObject.value.name}`
  }
  // Otherwise use the name
  return dataObject.value ? dataObject.value.name : 'No Title Found'
})
</script>
