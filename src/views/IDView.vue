<template>
  <div v-if="dataObject != undefined">
    <PageSectionTitle :pageTitle="title" />

    <!-- <DataSection
      v-for="(relatedObjs, objectType) in subtechniques"
      :key="objectType"
      :itemType="objectType"
      :items="relatedObjs"
      :parentObject="dataObject"
      style="border: 1px solid black; width: 50%; border-radius: 25px;"
    /> -->

    <v-row>
      <v-col :cols="mdAndUp ? 9 : 12">

        <v-list-item>
          <div
            v-html="markdown.render(dataObject.description)"
          />
        </v-list-item>
      </v-col>

      <v-col :cols="mdAndUp ? 3 : 12">
        <DataSidebar :data-object="dataObject" style="border: 1px solid black; border-radius: 25px;"/>
      </v-col>
    </v-row>
    <div v-for="entry in orderedObjects">
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
import { computed } from 'vue'
import DataSection from '@/components/data-display/DataSection.vue'
import DataSidebar from '@/components/data-display/DataSidebar.vue'
import PageSectionTitle from '@//components/PageSectionTitle.vue'
import ErrorNotFoundView from './ErrorNotFoundView.vue'
import MarkdownIt from 'markdown-it'
import { stringToSingular } from '@/assets/dataHelpers.js'
import { useDisplay } from 'vuetify'

// mobile boolean for contitional rendering
const { mdAndUp } = useDisplay()

const markdown = new MarkdownIt()
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

const relatedObjects = computed(() => {
  let relatedObjectsArrays = {}
  if (dataObject.value && dataObject.value.relatedObjects) {
    Object.keys(dataObject.value.relatedObjects).forEach((key) => {
      if (
        Array.isArray(dataObject.value.relatedObjects[key]) &&
        typeof dataObject.value.relatedObjects[key][0] !== 'string'
      ) {
        relatedObjectsArrays[key] = dataObject.value.relatedObjects[key]
      }
    })
  }
  return relatedObjectsArrays
})

const subtechniques = computed(()=> {
  return Object.fromEntries(
      Object.entries(relatedObjects.value)
        .filter(([key]) => key == 'subtechniques' || key == 'other subtechniques')
    );
})

const filteredRelatedObjects = computed(() => {
  // Allows a page to ignore specific fields within each json so that they do not appear.
  const ignore = ['tactic', 'tactics', 'subtechniques', 'other subtechniques',"case-study", "parent-technique"] 

  if (relatedObjects.value?.mitigation){
    relatedObjects.value.mitigation = relatedObjects.value.mitigation.map(item => ({
      ...item,
      label: item.name,
      columnNames: ["description"]
    }))
  }
  
  if(relatedObjects.value['case-study'] && dataObject.value['object-type'] == 'technique') {
    const procedure_examples = []
    relatedObjects.value['case-study'].forEach(cs => {
      cs.procedure.forEach(p => {
          if (p.technique == dataObject.value.id){
            procedure_examples.push({  
              id: cs.id,
              name: cs.name,
              actor: cs.actor,
              // tactic: relatedObjects.value.tactic ? relatedObjects.value.tactic.filter(tactic => tactic.id == p.tactic)[0].name : relatedObjects.value.tactics.filter(tactic => tactic.id == p.tactic)[0].name,
              tactic: {
                name: relatedObjects.value.tactic ? relatedObjects.value.tactic.filter(tactic => tactic.id == p.tactic)[0].name : relatedObjects.value.tactics.filter(tactic => tactic.id == p.tactic)[0].name,
                route: relatedObjects.value.tactic ? relatedObjects.value.tactic.filter(tactic => tactic.id == p.tactic)[0].route : relatedObjects.value.tactics.filter(tactic => tactic.id == p.tactic)[0].route,
              },
              description: p.description,
              'object-type': 'procedure_examples',
              label: cs.name,
              columnNames: ['actor', 'tactic', 'description'],
              route: cs.route
            })
          }
        }
      )
    })
    relatedObjects.value.procedure_examples = procedure_examples
  }
  return Object.fromEntries(
      Object.entries(relatedObjects.value)
        .filter(([key]) => !ignore.includes(key))
    );
})


const orderedObjects = computed(() => {
  const order = ['procedure_examples', 'case-study', 'mitigation']
  const orderedObjs = []
  order.forEach(k => {
    if (Object.keys(filteredRelatedObjects.value).includes(k)){
      orderedObjs.push({[k]: filteredRelatedObjects.value[k]})
    }
  })
  Object.keys(filteredRelatedObjects.value).forEach(k => {
    if(!(order.includes(k))){
      orderedObjs.push({[k]: filteredRelatedObjects.value[k]})
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
