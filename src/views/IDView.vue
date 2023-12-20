<template>

    <div v-if="dataObject != undefined">
      <div class="pa-3">
        <div class="text-h3 pa-10">
          {{ title }}
        </div>
        <v-row>
          <v-col cols="9">
              <v-list-item class="text-h5 text-left"
              style="text-transform: capitalize !important;"
              > 
              Summary
              </v-list-item>
              <v-list-item>

              <!-- Render description as markdown (or "summary") if it's a case study -->
              <!-- TODO: seperate component for case studies -->
              <div class="text-body-1 text-left pa-3" v-html="dataObject.description != undefined ? markdown.render(dataObject.description) : markdown.render(dataObject.summary)" />
            </v-list-item>
          </v-col>
  
          <v-col cols="3">
            <DataSidebar :data-object="dataObject" />
          </v-col>
  
        </v-row>
        <v-list>
          <DataSection v-for="(relatedObjs, objectType) in dataObject.relatedObjects" :key="objectType"
            :item-type="objectType" :items="relatedObjs" :parent-object="dataObject" />
        </v-list>
      </div>
    </div>
    <div v-else>
      <!-- Display ErrorNotFound if ID is not found -->
      <ErrorNotFoundView />
    </div>
  </template>
    
  <script setup>
    import { useMain } from "@/stores/main"
    import { useRoute } from 'vue-router'
    import { computed, onMounted } from 'vue' 
    import DataSection from '@/components/data-display/DataSection.vue'
    import DataSidebar from '@/components/data-display/DataSidebar.vue'
    import ErrorNotFoundView from "./ErrorNotFoundView.vue"
  
    import MarkdownIt from "markdown-it";
    const markdown = new MarkdownIt();
  
    const mainStore = useMain()
  
    // Collect the plural of the object type (tactics, techniques, etc) and the object ID from the URL
    const route = useRoute()
    let { id, objectTypePlural } = route.params

    // TODO: add side nav logic
    // definePageMeta({
    // //   layout: 'side-nav'
    // // })
    // onMounted(() => {
    //   mainStore.setNavItems(mainStore.getDataObjectsByType(objectTypePlural))
    // })

    let dataObject = computed(() => {
      return mainStore.getDataObjectById(id)
    })
    console.log(dataObject)
    
    let title = computed(() => {
      // Prepend parent technique name for a subtechnique
      if ("subtechnique-of" in dataObject.value) {
        const parentTechnique = mainStore.getParent(
          dataObject.value
        )
        return `${parentTechnique.name}: ${dataObject.value.name}`
      }
      // Otherwise use the name
      return dataObject.value.name
    })
    
  </script>
    