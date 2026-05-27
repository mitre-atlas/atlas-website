<template>
  <div v-if="study != undefined">
    <div class="text-h3 my-5">
      <span>{{ title }}</span>
    </div>

    <v-row align="start">
      <v-col cols="12" md="9">
        <p class="pl-3 ml-6" v-html="md.render(descriptionWithCitations)" />
      </v-col>
      <v-col cols="12" md="3">
        <DataSidebar :data-object="studyWithRelations" variant="outlined" />
        <div class="mt-4 text-md-right">
          <DownloadDataDropdown :study="study" />
        </div>
      </v-col>
    </v-row>

    <br />
    <v-divider class="pb-10" />

    <v-row align="center">
      <v-col>
        <div class="text-h5 ml-6 text-capitalize">Attack Chain</div>
      </v-col>
      <v-col class="text-right" v-if="!hide_layers_for_studies.includes(study.id)">
        <NavigatorLayerDropdown :study="study" />
      </v-col>
    </v-row>

    <v-row>
      <ProcedureTimeline :study="study" />
    </v-row>

    <div v-if="orderedReferences.length > 0" class="ml-6">
      <p class="text-h5 mt-10">References</p>
      <div
        v-for="(reference, index) in orderedReferences"
        :key="reference.id || reference.url || index"
        class="pl-3 mb-2"
      >
        <span>{{ index + 1 }}. </span>
        <a v-if="reference.url" :href="reference.url" target="_blank" rel="noopener noreferrer">
          {{ getReferenceDisplayText(reference) }}
          <v-icon icon="mdi-open-in-new" size="small" />
        </a>
        <div v-else>
          {{ getReferenceDisplayText(reference) }}
        </div>
      </div>
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
import ErrorNotFoundView from './ErrorNotFoundView.vue'
import {
  getReferenceDisplayText,
  resolveDescriptionCitations
} from '@/assets/tools.js'
import ProcedureTimeline from '@/components/ProcedureTimeline.vue'
import DownloadDataDropdown from '@/components/DownloadDataDropdown.vue'
import DataSidebar from '@/components/data-display/DataSidebar.vue'
import NavigatorLayerDropdown from '@/components/NavigatorLayerDropdown.vue'
import { useHead } from '@unhead/vue'

const md = inject('markdownit')

const mainStore = useMain()

// Collect the plural of the object type (tactics, techniques, etc) and the object ID from the URL
const route = useRoute()
const { id } = route.params

const study = computed(() => {
  return mainStore.getDataObjectById(id)
})

const studyWithRelations = computed(() => {
  if (!study.value) {
    return undefined
  }

  const relatedObjects = mainStore.getRelatedDataObjects(study.value)
  const excludedFields = new Set(['date', 'reporter', 'actor', 'target'])
  const filteredRelatedObjects = Object.fromEntries(
    Object.entries(relatedObjects).filter(([key]) => !excludedFields.has(key))
  )

  return {
    ...study.value,
    relatedObjects: filteredRelatedObjects
  }
})

const resolvedDescription = computed(() => {
  const description = study.value?.description || ''
  const references = study.value?.references || []
  return resolveDescriptionCitations(description, references)
})

const descriptionWithCitations = computed(() => resolvedDescription.value.description)

const orderedReferences = computed(() => resolvedDescription.value.orderedReferences)

const title = computed(() => study.value.name)
useHead({
  title
})

// Hide layer dropdowns for selected case studies until data is published
const hide_layers_for_studies = []
</script>
