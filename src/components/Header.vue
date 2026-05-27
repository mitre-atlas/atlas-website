<template>
  <v-app-bar dark clipped-left elevate-on-scroll color="navy">
    <v-app-bar-nav-icon color="white" v-if="doesPageHaveSideNav" @click.prevent="toggle()" />

    <h1 class="pa-3">
      <router-link :to="homeRoute">
        <img src="../assets/graphics/MITRE_ATLAS_light.svg" width="200" contain />
      </router-link>
    </h1>

    <v-chip
      v-if="showVersionIndicator"
      size="small"
      color="white"
      variant="outlined"
      class="mr-2"
    >
      Version: {{ activeVersion }}
    </v-chip>

    <v-spacer />
    <template v-if="mdAndUp">
      <v-toolbar-items v-for="(link, i) in linksModded" :key="i">
        <v-menu v-if="link.isDropdown" close-on-click>
          <template #activator="{ props }">
            <v-btn v-bind="props" class="text-capitalize" variant="text">
              {{ link.name }}
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list class="hidden-sm-and-down">
            <v-item-group theme="dark">
              <v-list-item
                v-for="(childLink, j) in link.links"
                :key="j"
                :to="childLink.to"
                :href="childLink.href"
                class="px-6 text-button text-capitalize"
              >
                {{ childLink.name }}
              </v-list-item>
            </v-item-group>
          </v-list>
        </v-menu>
        <VAtlasBtnPrimary
          v-else-if="link.name === 'Contribute'"
          :to="link.to"
          class="my-auto ml-3 mr-5"
          stacked
        >
          {{ link.name }}
        </VAtlasBtnPrimary>
        <v-btn v-else :to="link.to" class="text-capitalize" stacked>{{ link.name }}</v-btn>
      </v-toolbar-items>
    </template>
    <v-toolbar-items v-if="smAndDown">
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <div v-for="(link, i) in linksModded" :key="i">
            <div v-if="link.isDropdown">
              <v-list-item
                v-for="(childLink, j) in link.links"
                :key="j"
                :to="childLink.to"
                :href="childLink.href"
                class="px-6 text-button text-capitalize"
              >
                {{ childLink.name }}
              </v-list-item>
            </div>
            <v-list-item
              v-else
              :to="link.to"
              text
              exact
              class="px-6 text-button text-capitalize"
            >
              {{ link.name }}
            </v-list-item>
          </div>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script setup>
/**
 * Header navigation bar, present on every page.
 * Included in the layout files.
 */

import { useMain } from '@/stores/main'
import { dataObjectToPluralTitle } from '@/assets/dataHelpers.js'
import { getStoreObjectCollectionKey } from '@/assets/objectTypes.js'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const mainStore = useMain()
const { mdAndUp, smAndDown } = useDisplay() // Used for breakpoints

const activeVersion = computed(() => mainStore.getActiveNavigationVersion)

const showVersionIndicator = computed(() => {
  const section = route.meta?.section
  const hideSections = new Set(['resources', 'contribute', 'tools'])
  return Boolean(activeVersion.value) && !hideSections.has(section)
})

function withVersion(name, params = {}) {
  if (activeVersion.value) {
    return { name, params: { ...params, version: activeVersion.value } }
  }
  return { name, params }
}

/**
 * Matrices link in navbar
 * @returns {Array}
 */
const linksBeginning = computed(() => {
  const matrixId = mainStore.getFirstMatrixId
  const matrixRoute = matrixId
    ? withVersion(activeVersion.value ? 'VersionedMatrix' : 'Matrix', {
        id: matrixId
      })
    : { name: 'Home' }

  return [
    {
      name: 'Matrix',
      to: matrixRoute
    }
  ]
})

const homeRoute = computed(() => {
  if (activeVersion.value) {
    return { name: 'VersionedHome', params: { version: activeVersion.value } }
  }
  return { name: 'Home' }
})

/**
 * Array of objects of the dropdown menus in the navigation bar
 * @type {Array}
 */
const linksEnding = computed(() => [
  {
    name: 'Case Studies',
      to: withVersion(
        activeVersion.value ? 'VersionedDataObjectList' : 'DataObjectList',
        { objectTypePlural: 'studies' }
      )
  },
  {
    name: 'Tools',
    isDropdown: true,
    links: [
      {
        name: 'ATLAS Navigator',
        to: { name: 'Navigator' }
      },
      {
        name: 'ATLAS Knowledge Graph',
        to: { name: 'KnowledgeGraph' }
      },
      {
        name: 'ATLAS in Attack Flow',
        to: { name: 'AttackFlow' }
      }
    ]
  },
  {
    name: 'Resources',
    isDropdown: true,
    links: [
      {
        name: 'General information',
        to: { name: 'GeneralInformation' }
      },
      {
        name: 'Updates',
        to: '/resources/updates'
      },
      {
        name: 'Version History',
        to: { name: 'AtlasVersions' }
      },
      {
        name: 'Contact Us',
        to: { name: 'Contact' }
      },
      {
        name: 'AI Security 101',
        to: { name: 'AiSecurity101' }
      },
      {
        name: 'Glossary',
        to: { name: 'Glossary' }
      }
    ]
  },
  {
    name: 'Contribute',
    to: { name: 'Contribute' }
  }
])

/**
 * Add the Header names and links
 * @returns {Object}
 */
const linksModded = computed(() => {
  // Add data object links
  const dataKeys = mainStore.getDataObjectTypes
  // Do not generate a route for case studies, which has its own defined templates
  const studiesCollectionKey = getStoreObjectCollectionKey('studies')
  const dynamicDataKeys = dataKeys.filter((k) => k !== studiesCollectionKey)
  const dataLinks = dynamicDataKeys.map((objectType) => {
    return {
      name: `${dataObjectToPluralTitle(objectType)}`, // Plural version
      to: withVersion(
        activeVersion.value ? 'VersionedDataObjectList' : 'DataObjectList',
        { objectTypePlural: dataObjectToPluralTitle(objectType, true) }
      )
    }
  })

  // Sandwich data links between beginning and end links
  return linksBeginning.value.concat(dataLinks).concat(linksEnding.value)
})

const routeMeta = computed(() => route.meta || {})

const doesPageHaveSideNav = computed(() => {
  const metaValue = routeMeta.value.showSideNav
  if (typeof metaValue === 'boolean') {
    return metaValue
  }

  return false
})

function toggle() {
  mainStore.TOGGLE_NAV_DRAWER()
}
</script>
