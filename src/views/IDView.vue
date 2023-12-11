<template>

    <div>
      <div>
        <div class="text-h3">
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
  
              <div class="text-body-1 text-left pa-3" v-html="markdown.render(dataObject.description)" />
            </v-list-item>
          </v-col>
  
          <v-col cols="3">
            <DataSidebar :data-object="dataObject" />
          </v-col>
  
        </v-row>
        <!-- TODO: complete data link child components -->
        <v-list>
          <DataSection v-for="(relatedObjs, objectType) in dataObject.relatedObjects" :key="objectType"
            :item-type="objectType" :items="relatedObjs" :parent-object="dataObject" />
        </v-list>
      </div>
    </div>
  </template>
    
  <script setup>
    import { useMain } from "@/stores/main"
    import { useRoute } from 'vue-router'
    import { computed, onMounted } from 'vue' 
    import DataSection from '@/components/data-display/DataSection.vue'
    import DataSidebar from '@/components/data-display/DataSidebar.vue'
  
    import MarkdownIt from "markdown-it";
    const markdown = new MarkdownIt();
  
    const mainStore = useMain()
  
    // Collect the plural of the object type (tactics, techniques, etc) and the object ID from the URL
    const route = useRoute()
    let { id, objectTypePlural } = route.params

    if (id.includes('AML') && !id.includes('AML.')){
        id = id.split('AML').join('AML.')
    }
  
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
    