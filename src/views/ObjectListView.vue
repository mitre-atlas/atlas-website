<template>

  <div v-if="isObjectTypeValid">
    <InfoTable :objectTypePlural="objectTypePlural"></InfoTable>
  </div>
  <div v-else>
    <!-- Display ErrorNotFound if object type is not found -->
    <ErrorNotFoundView />
  </div>
</template>
  
<script setup>
  import ErrorNotFoundView from "./ErrorNotFoundView.vue"
  import InfoTable from "../components/data-display/InfoTable.vue"
  import { computed } from 'vue' 

  import { useRoute } from 'vue-router'
  import { useMain } from "@/stores/main"

  const mainStore = useMain()

  const route = useRoute()

  let { objectTypePlural } = route.params

  // String representing the correct name in the url for case studies
  const case_studies_name = "studies"

  let isObjectTypeValid = computed(() => {
      if (objectTypePlural == case_studies_name) {
        objectTypePlural = case_studies_name
        return true
      }
      return (Object.keys(mainStore.getDataObjectTypes)).includes(objectTypePlural)
  })

  
</script>
  