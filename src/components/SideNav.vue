<template>
  <v-navigation-drawer v-model="doShowNavDrawer" :width="325" class="pl-3" mobile-breakpoint="md">
    <v-list-item-title class="mt-10 text-h5 text-capitalize">
      {{ title }}
    </v-list-item-title>

    <v-list
      v-if="title === 'techniques' || title === 'tactics'"
      v-model:opened="open"
      open-strategy="multiple"
      density="compact"
      style="width: 310px"
    >
      <v-list-group
        v-for="(tacticObjects, matrixID, i) in data"
        :key="i"
        :value="`matrix:${matrixID}`"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <span @click="$router.push(getMatrixRoute(matrixID))" class="link">
              {{ matrixID }}
            </span>
          </v-list-item>
        </template>
        <div v-if="title === 'tactics'">
          <v-list-item
            v-for="(tactic, i) in tacticObjects"
            :key="i"
            :to="tactic.route"
            :title="tactic.name"
            class="ml-3 text-body-2 link"
          />
        </div>
        <v-list
          v-if="title === 'techniques'"
          :opened="expandedTactics"
          open-strategy="multiple"
          density="compact"
        >
          <v-list-group
            v-for="(tactic, j) in tacticObjects"
            :key="j"
            subgroup
            class="text-body-2"
            :value="tactic.name"
          >
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <span @click="$router.push(tactic.route)" class="link">
                  {{ tactic.name }}
                </span>
              </v-list-item>
            </template>
            <div v-for="(technique, i) in tactic.techniques" :key="i">
              <v-list-item :to="technique.route" :value="`technique:${tactic.id}:${technique.id}`">
                <div class="ml-13">
                  {{ technique.name }}
                </div>
              </v-list-item>
              <v-list-item
                v-for="(subtechnique, subIndex) in technique.subtechniques"
                :key="subIndex"
                :to="subtechnique.route"
                :value="`subtechnique:${tactic.id}:${technique.id}:${subtechnique.id}`"
              >
                <div class="ml-16">
                  {{ subtechnique.name }}
                </div>
              </v-list-item>
            </div>
          </v-list-group>
        </v-list>
      </v-list-group>
    </v-list>
    <v-list v-else class="text-body-2">
      <v-list-item v-for="(item, i) in data" :key="i" :to="item.route" class="link">
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useMain } from '@/stores/main'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { getStoreObjectCollectionKey, isMatrixTypeKey } from '@/assets/objectTypes.js'

const { mdAndDown } = useDisplay()

const route = useRoute()

const mainStore = useMain()

const currentVersion = computed(() => {
  return typeof route.params.version === 'string' ? route.params.version : ''
})

function getMatrixRoute(matrixID) {
  return currentVersion.value
    ? `/v/${encodeURIComponent(currentVersion.value)}/matrices/${matrixID}`
    : `/matrices/${matrixID}`
}

const title = computed(() => {
  const section = route.meta?.section
  if (typeof section === 'string' && section.length > 0) {
    if (section === 'data') {
      const objectTypePlural = route.params.objectTypePlural
      return typeof objectTypePlural === 'string' ? objectTypePlural : ''
    }

    if (section === 'studies' || section === 'matrices') {
      return section
    }
  }

  const objectTypePlural = route.params.objectTypePlural
  if (typeof objectTypePlural === 'string' && objectTypePlural.length > 0) {
    return objectTypePlural
  }

  return ''
})

const data = computed(() => {
  const matrixId = mainStore.getFirstMatrixId
  if (title.value === 'tactics' || title.value === 'techniques') {
    return mainStore.$state.data.objects.tactics
  }
  if (title.value === 'studies') {
    const studies = mainStore.$state.data.objects[getStoreObjectCollectionKey('studies')] || []
    return [...studies].sort((a, b) => b.id.localeCompare(a.id))
  }
  if (title.value === 'mitigations') {
    return mainStore.$state.data.objects.mitigations[matrixId]
  }
  return mainStore.$state.data.matrices
})

const allMatrixOpenKeys = computed(() => {
  if (!isMatrixTypeKey(title.value) || title.value === 'mitigations') {
    return [title.value]
  }
  return Object.keys(data.value || {}).map((matrixId) => `matrix:${matrixId}`)
})

const allTechniqueTacticNames = computed(() => {
  if (title.value !== 'techniques') {
    return []
  }

  const names = new Set()
  Object.values(data.value || {}).forEach((tactics) => {
    tactics.forEach((tactic) => {
      names.add(tactic.name)
    })
  })

  return Array.from(names)
})

const open = ref(allMatrixOpenKeys.value)

watch([title, data], () => {
  open.value = allMatrixOpenKeys.value
})

if (mdAndDown.value) {
  // initially hide drawer on smaller screens
  mainStore.$state.doShowNavDrawer = false
}

const doShowNavDrawer = computed({
  // getter
  get() {
    return mainStore.$state.doShowNavDrawer
  },
  // setter
  set(value) {
    mainStore.TOGGLE_NAV_DRAWER(value)
  },
})

const expandedTactics = ref([])

const techniqueID = computed(() => {
  if (route.params.objectTypePlural === 'techniques' && route.params.id) {
    return route.params.id
  }
  return null
})

const tacticNamesByTechniqueId = computed(() => {
  const matrixId = mainStore.getFirstMatrixId
  const matrixTactics = data.value?.[matrixId] || []
  const lookup = new Map()

  matrixTactics.forEach((tactic) => {
    tactic.techniques.forEach((technique) => {
      if (!lookup.has(technique.id)) {
        lookup.set(technique.id, new Set())
      }
      lookup.get(technique.id).add(tactic.name)
      ;(technique.subtechniques || []).forEach((subtechnique) => {
        if (!lookup.has(subtechnique.id)) {
          lookup.set(subtechnique.id, new Set())
        }
        lookup.get(subtechnique.id).add(tactic.name)
      })
    })
  })

  return lookup
})

watch(techniqueID, (newVal) => {
  if (title.value === 'techniques') {
    const tacticNames = tacticNamesByTechniqueId.value.get(newVal)
    expandedTactics.value = tacticNames ? Array.from(tacticNames) : allTechniqueTacticNames.value
  }
})

watch([title, data], () => {
  if (title.value === 'techniques' && !techniqueID.value) {
    expandedTactics.value = allTechniqueTacticNames.value
  }
})
</script>

<style>
.v-list-group__items {
  --indent-padding: 0px !important;
}

.link {
  color: #1976d2 !important;
}
</style>
