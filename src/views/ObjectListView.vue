<template>
  <div v-if="isObjectTypeValid" class="text-left pt-10 pr-12 pl-12 pb-10">
    <p class="text-h3 mt-10 mb-5 text-capitalize">
      {{ objectTypePlural === 'studies' ? 'Case Studies' : objectTypePlural }}
    </p>
    <p
      v-html="introText"
      style="white-space: pre-wrap;"
    />
    <StudiesIntroText v-if="objectTypePlural === 'studies'" />

    <p class="my-6">
      The table below lists {{ objectTypePlural }} from {{ VITE_MITRE_TITLE }}.
      Scroll through the table or use the filter to narrow down the information.
    </p>

    <InfoTable :items="tableItems"></InfoTable>
  </div>
  <div v-else>
    <!-- Display ErrorNotFound if object type is not found -->
    <ErrorNotFoundView />
  </div>
</template>
  
<script setup>
  import ErrorNotFoundView from "./ErrorNotFoundView.vue"
  import InfoTable from "../components/data-display/InfoTable.vue"
  import { computed, ref } from 'vue' 

  import { useRoute } from 'vue-router'
  import { useMain } from "@/stores/main"

  import jsyaml from 'js-yaml';
  import StudiesIntroText from "./StudiesIntroText.vue"

  const mainStore = useMain()

  const route = useRoute()

  let { objectTypePlural } = route.params
  const { VITE_MITRE_TITLE } = import.meta.env 

  let introText = ref('');

  if(objectTypePlural !== 'studies') {
    fetch('/content/data-list-page-intros.yaml')
    .then(response => response.text())
    .then(data => {
      introText.value = jsyaml.load(data)[objectTypePlural];
      // remove single \n, but keep \n\n
      introText.value = introText.value.replace(/(?<!\n)\n(?!\n)/g, "");
    })
    .catch(error => {
      console.error('Error fetching YAML file:', error);
    });
  }

  // String representing the correct name in the url for case studies
  const case_studies_name = "studies"

  let isObjectTypeValid = computed(() => {
      if (objectTypePlural == case_studies_name) {
        objectTypePlural = case_studies_name
        return true
      }
      return (Object.keys(mainStore.getDataObjectTypes)).includes(objectTypePlural)
  })

  const tableItems = computed(() => {
    // Get case study objects if needed (store has it with the hyphen)
    if (objectTypePlural == "studies") {
      return mainStore.getDataObjectsByType('case-studies')
    }
    return mainStore.getDataObjectsByType(objectTypePlural)
  })

  
</script>
  