<template>
  <v-breadcrumbs
    v-if="route.path !== '/'"
    :items="items"
    color="blue"
    class="mt-7 text-capitalize pl-0 text-body-2"
  >
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

const route = useRoute()

const mainStore = useMain()

const items = reactive([
  {
    title: 'Home',
    disabled: false,
    to: '/'
  }
])

const path = computed(() => {
  return route.path.split('/').slice(1)
})

const pageNotFound = computed(() => {
  return mainStore.$state.pageNotFoundDisplaying
})

watch(pageNotFound, () => {
  if (pageNotFound.value) {
    items.push({
      title: 'Page not found',
      disabled: true
    })
  }
})

const dataTypes = ['tactics', 'techniques', 'mitigations', 'studies']

watch(
  path,
  () => {
    items.splice(1)

    items.push({
      title: path.value[0],
      disabled: path.value.length === 1 || path.value[0] === 'matrices' ? true : false,
      to: dataTypes.includes(path.value[0]) ? `/${path.value[0]}` : '/resources/info'
    })

    let breadItem = {}
    if (path.value.length >= 2) {
      if (path.value[0] === 'matrices') {
        breadItem = mainStore.getMatrixByID(route.params.id)
      } else if (!dataTypes.includes(path.value[0])) {
        breadItem = {
          name: path.value[1],
          route: path.value[1] === 'updates' ? '/resources/updates' : ''
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
          to: parentTechnique?.route || ''
        })
      }
      if (breadItem?.name) {
        items.push({
          title: breadItem.name,
          disabled: true,
          to: breadItem?.route || ''
        })
      }
    }
    if (path.value.length === 3) {
      items.push({
        title: path.value[2],
        disabled: true
      })
    }
  },
  { immediate: true }
)
</script>
