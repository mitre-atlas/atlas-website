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

  let isObjectTypeValid = computed(() => {
      return (Object.keys(mainStore.getDataObjectTypes)).includes(objectTypePlural)
  })

  
</script>
  