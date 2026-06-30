<template>
  <v-card flat class="mt-0">
    <v-card-text class="text-body-2">
      <p><span class="font-weight-bold">ID:</span> {{ dataObject.id }}</p>
      <div>
        <div v-for="(relatedObjs, objectType) in sidebarFields" :key="objectType">
          <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" />
        </div>
      </div>
      <div class="pb-4">
        <span class="font-weight-bold">Created:</span>
        {{ formatDate(dataObject['created-date']) }}
      </div>
      <div>
        <span class="font-weight-bold">Last Modified:</span>
        {{ formatDate(dataObject['modified-date']) }}
      </div>
      <div v-if="sidebarVersionLink" class="pt-4">
        <v-divider class="mb-3" />
        <router-link :to="sidebarVersionLink.to">{{ sidebarVersionLink.label }}</router-link>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import DataSidebarEntry from '@/components/data-display/DataSidebarEntry.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAtlasTermDescription } from '@/config/atlasTermCatalog'
import { formatCaseStudyIncidentDate } from '@/assets/tools.js'
import { useMain } from '@/stores/main'

const { dataObject } = defineProps(['dataObject'])
const route = useRoute()
const mainStore = useMain()

function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) {
    return ''
  }

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    timeZone: 'UTC',
  }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
}

const getNumMitigations = () => {
  const related = dataObject.relatedObjects || {}
  if ('mitigations' in related) {
    return related['mitigations'].length
  } else if ('mitigation' in related) {
    return related['mitigation'].length
  }
  return 0
}

const sidebarFields = computed(() => {
  const related = dataObject.relatedObjects || {}
  const ordered: Record<string, unknown> = {}

  const setIfPresent = (key: string, value: unknown) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value) && value.length === 0) return
    ordered[key] = value
  }

  setIfPresent('attack-reference', dataObject['attack-reference'])
  setIfPresent('subtechnique-of', related['parent-technique'])
  setIfPresent('tactics', related['tactics'])

  if (
    typeof dataObject.maturity === 'string' &&
    getAtlasTermDescription('maturity', dataObject.maturity)
  ) {
    setIfPresent('maturity', dataObject.maturity)
  }

  if (Array.isArray(dataObject.platforms)) {
    const validPlatforms = dataObject.platforms.filter(
      (platform: unknown) =>
        typeof platform === 'string' && getAtlasTermDescription('platforms', platform)
    )
    setIfPresent('platforms', validPlatforms.length > 0 ? validPlatforms : ['None'])
  }

  setIfPresent('categories', dataObject.categories)
  setIfPresent('lifecycle-phases', dataObject['lifecycle-phases'])

  if (Array.isArray(related['case-study'])) {
    setIfPresent('number-of-case-studies', related['case-study'].length)
  }

  if (dataObject['object-type'] == 'technique') {
    const mitigationCount = getNumMitigations()
    setIfPresent('number-of-mitigations', mitigationCount)
  }

  if (dataObject['object-type'] === 'mitigation' && Array.isArray(related['technique'])) {
    setIfPresent('number-of-techniques', related['technique'].length)
  }

  if (dataObject['object-type'] === 'case-study') {
    setIfPresent('type', dataObject.type)
    setIfPresent('date', formatCaseStudyIncidentDate(dataObject))
    setIfPresent('reporter', dataObject.reporter)
    setIfPresent('actor', dataObject.actor)
    setIfPresent('target', dataObject.target)
  }

  Object.entries(related).forEach(([key, value]) => {
    if (key === 'parent-technique' || key === 'subtechniques' || key === 'other subtechniques')
      return
    if (
      (dataObject['object-type'] === 'technique' &&
        (key === 'case-study' || key === 'mitigation' || key === 'mitigations')) ||
      (dataObject['object-type'] === 'mitigation' && key === 'technique')
    ) {
      return
    }
    if (!(key in ordered)) {
      setIfPresent(key, value)
    }
  })

  return ordered
})

const sidebarVersionLink = computed(() => {
  const routePath = String(route.path || '')
  const routeQuery = route.query
  const routeHash = route.hash
  const routeVersion = typeof route.params.version === 'string' ? route.params.version : ''

  if (routeVersion) {
    const unversionedPath = routePath.replace(/^\/v\/[^/]+/, '') || '/'
    return {
      label: 'Latest Version',
      to: {
        path: unversionedPath,
        query: routeQuery,
        hash: routeHash,
      },
    }
  }

  const currentDataVersion = String(mainStore.getDataAttribute('version') || '').trim()
  if (!currentDataVersion) {
    return null
  }

  return {
    label: `Version Permalink (v${currentDataVersion})`,
    to: {
      path: `/v/${encodeURIComponent(currentDataVersion)}${routePath}`,
      query: routeQuery,
      hash: routeHash,
    },
  }
})
</script>
