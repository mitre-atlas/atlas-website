<template>
  <div v-if="isObjectTypeValid">
    <PageSectionTitle :pageTitle="title" />
    <p v-html="introText" style="white-space: pre-wrap" />
    <StudiesIntroText v-if="objectTypePlural === 'studies'" />

    <p class="my-6">
      The table below lists {{ objectTypePlural }} from {{ MITRE_TITLE }}. Scroll through the
      table or use the filter to narrow down the information.
    </p>

    <InfoTable :items="tableItems"></InfoTable>
  </div>
  <div v-else>
    <!-- Display ErrorNotFound if object type is not found -->
    <ErrorNotFoundView />
  </div>
</template>

<script setup>
import PageSectionTitle from '@//components/PageSectionTitle.vue'
import ErrorNotFoundView from './ErrorNotFoundView.vue'
import InfoTable from '../components/data-display/InfoTable.vue'
import { computed, ref } from 'vue'

import { useRoute } from 'vue-router'
import { useMain } from '@/stores/main'

import jsyaml from 'js-yaml'
import StudiesIntroText from './StudiesIntroText.vue'

import { getPathWithBase, capitalize } from '@/assets/tools.js'
import { MITRE_TITLE } from '@/config/env'
import {
  getStoreObjectCollectionKey,
  getTypeLabel,
  normalizeTypeKey,
  isKnownTypeKey
} from '@/assets/objectTypes.js'

const mainStore = useMain()

const route = useRoute()

const rawObjectTypePlural = String(route.params.objectTypePlural || '')
const objectTypePlural = normalizeTypeKey(rawObjectTypePlural)

const introText = ref('')
const title = ref(capitalize(getTypeLabel(objectTypePlural, false, true) || objectTypePlural))

if (objectTypePlural !== 'studies') {
  fetch(getPathWithBase('/content/data-list-page-intros.yaml'))
    .then((response) => response.text())
    .then((data) => {
      introText.value = jsyaml.load(data)[objectTypePlural]
      // remove single \n, but keep \n\n
      introText.value = introText.value.replace(/(?<!\n)\n(?!\n)/g, '')
      // ensure there is a space after every period
      introText.value = introText.value.replace(/\.([^\s])/g, '. $1')
    })
    .catch((error) => {
      console.error('Error fetching YAML file:', error)
    })
}

const isObjectTypeValid = computed(() => {
  if (isKnownTypeKey(objectTypePlural)) {
    return true
  }
  return mainStore.getDataObjectTypes.includes(objectTypePlural)
})

const tableItems = computed(() => {
  return mainStore.getDataObjectsByType(getStoreObjectCollectionKey(objectTypePlural))
})
</script>
