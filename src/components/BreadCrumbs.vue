<template>
  <v-breadcrumbs :items="items" color="blue" class="mt-7 text-capitalize pl-0 text-body-2">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right" size="x-small" />
    </template>
    <template v-slot:title="{ item }">
      <span :style="{ color: item.disabled ? 'black' : '#1976d2' }">{{ item.title }}</span>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { reactive, computed, watch } from 'vue'
import { useMain } from '@/stores/main'
import { isDataRouteTypeKey } from '@/assets/objectTypes.js'

const route = useRoute()

const mainStore = useMain()

const routeVersion = computed(() => {
  return typeof route.params.version === 'string' ? route.params.version : ''
})

const items = reactive([
  {
    title: 'Home',
    disabled: false,
    to: '/',
  },
])

const currentVersion = computed(() => {
  return mainStore.getActiveNavigationVersion
})

function withVersion(path) {
  return currentVersion.value ? `/v/${encodeURIComponent(currentVersion.value)}${path}` : path
}

const path = computed(() => {
  const parts = route.path.split('/').slice(1)
  if (parts[0] === 'v' && parts[1]) {
    return parts.slice(2)
  }
  return parts
})

const pageNotFound = computed(() => {
  return mainStore.$state.pageNotFoundDisplaying
})

watch(pageNotFound, () => {
  if (pageNotFound.value) {
    items.push({
      title: 'Page not found',
      disabled: true,
    })
  }
})

watch(
  path,
  () => {
    items[0].to = withVersion('/')
    const version = routeVersion.value
    const section = path.value[0] || ''
    const isDataType = isDataRouteTypeKey(section)

    items.splice(1)

    if (version) {
      items.push({
        title: `Version ${version}`,
        disabled: false,
        to: withVersion('/'),
      })
    }

    items.push({
      title: section,
      disabled: path.value.length === 1 || section === 'matrices' ? true : false,
      to: isDataType ? withVersion(`/${section}`) : '/resources/info',
    })

    let breadItem = {}
    if (path.value.length >= 2) {
      if (path.value[0] === 'matrices') {
        breadItem = mainStore.getMatrixByID(route.params.id)
      } else if (!isDataType) {
        breadItem = {
          name: path.value[1],
          route: path.value[1] === 'updates' ? '/resources/updates' : '',
        }
      } else if (path.value[0] === 'studies' && path.value[1] === 'create') {
        breadItem = { name: 'Create' }
      } else {
        breadItem = mainStore.getDataObjectById(route.params.id)
      }
      if (breadItem?.['subtechnique-of']) {
        const parentTechnique = mainStore.getDataObjectById(breadItem['subtechnique-of'])
        items.push({
          title: parentTechnique.name,
          disabled: false,
          to: parentTechnique?.route || '',
        })
      }
      if (breadItem?.name) {
        items.push({
          title: breadItem.name,
          disabled: true,
          to: breadItem?.route || '',
        })
      }
    }
    if (path.value.length === 3) {
      items.push({
        title: path.value[2],
        disabled: true,
      })
    }
  },
  { immediate: true }
)
</script>
