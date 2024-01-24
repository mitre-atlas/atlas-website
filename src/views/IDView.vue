<template>
  <div v-if="dataObject != undefined">
      <PageSectionTitle :pageTitle="title"/>
      <v-row>
        <v-col cols="9">
            <v-list-item class="text-h5"> 
              Summary
            </v-list-item>

            <v-list-item>
              <div class="text-body-1 pa-3" v-html="markdown.render(dataObject.description)" />
          </v-list-item>
        </v-col>

        <v-col cols="3">
          <DataSidebar :data-object="dataObject" />
        </v-col>

      </v-row>

      <DataSection 
        v-for="(relatedObjs, objectType) in relatedObjects" 
        :key="objectType"
        :itemType="objectType" 
        :items="relatedObjs" 
        :parentObject="dataObject"
      />
  </div>
  <div v-else>
      <!-- Display ErrorNotFound if ID is not found -->
      <ErrorNotFoundView />
  </div>

  </template>
    
  <script setup>

    import { useMain } from "@/stores/main"
    import { useRoute } from 'vue-router'
    import { computed } from 'vue' 
    import DataSection from '@/components/data-display/DataSection.vue'
    import DataSidebar from '@/components/data-display/DataSidebar.vue'
    import PageSectionTitle from "@//components/PageSectionTitle.vue"
    import ErrorNotFoundView from "./ErrorNotFoundView.vue"
    import MarkdownIt from "markdown-it";
    import { stringToSingular } from "@/assets/dataHelpers.js";

    const markdown = new MarkdownIt();
    const mainStore = useMain()

    // Collect the plural of the object type (tactics, techniques, etc) and the object ID from the URL
    const route = useRoute()
    const { id, objectTypePlural } = route.params

    // Get the data for this element
    const dataObject = computed(() => {
      const obj = mainStore.getDataObjectById(id)

      // Don't set object if the URL's object type is wrong -- should show 404
      if (!obj || obj['object-type'] !== stringToSingular(objectTypePlural))
        return undefined
        
      return mainStore.getDataObjectById(id)
    })

    const relatedObjects = computed(() => {
      let relatedObjectsArrays = {}
      if (dataObject.value && dataObject.value.relatedObjects) {
        Object.keys(dataObject.value.relatedObjects).forEach((key) => {
          if(Array.isArray(dataObject.value.relatedObjects[key]) && typeof dataObject.value.relatedObjects[key][0] !== 'string') {
            relatedObjectsArrays[key] = dataObject.value.relatedObjects[key]
          }
        })
      }
      return relatedObjectsArrays
    })

    // Page title is the element name
    const title = computed(() => {
      // Prepend parent technique name for a subtechnique
      if (dataObject.value && "subtechnique-of" in dataObject.value) {
        const parentTechnique = mainStore.getParent(dataObject.value)
        return `${parentTechnique.name}: ${dataObject.value.name}`
      }
      // Otherwise use the name
      return dataObject.value ? dataObject.value.name : 'No Title Found'
    })

  </script>
  
    