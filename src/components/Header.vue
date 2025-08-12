<template>
  <v-app-bar dark clipped-left elevate-on-scroll color="navy">
    <v-app-bar-nav-icon color="white" v-if="doesPageHaveSideNav" @click.prevent="toggle()" />

    <h1 class="pa-3">
      <router-link to="/">
        <img src="../assets/graphics/MITRE_ATLAS_light.svg" width="200" contain />
      </router-link>
    </h1>

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

        <v-btn v-else :to="link.to" class="text-capitalize" v-text="link.name" stacked />
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
                v-text="childLink.name"
              />
            </div>
            <v-list-item
              v-else
              :to="link.to"
              text
              exact
              class="px-6 text-button text-capitalize"
              v-text="link.name"
            />
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
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { getPathWithBase } from '@/assets/tools'

const route = useRoute()
const mainStore = useMain()
const { mdAndUp, smAndDown } = useDisplay() // Used for breakpoints

/**
 * Matrices link in navbar
 * @returns {Array}
 */
const linksBeginning = computed(() => {
  return [
    {
      name: 'Matrix',
      to: `/matrices/${mainStore.getFirstMatrixId}`
    }
  ]
})

/**
 * Array of objects of the dropdown menus in the navigation bar
 * @type {Array}
 */
const linksEnding = [
  {
    name: 'Case Studies',
    isDropdown: true,
    links: [
      {
        name: 'Explore Case Studies',
        to: '/studies'
      },
      {
        name: 'Build Case Study',
        to: '/studies/create'
      }
    ]
  },
  {
    name: 'Resources',
    isDropdown: true,
    links: [
      {
        name: 'General information',
        to: '/resources/info'
      },
      {
        name: 'FAQ',
        to: '/resources/faq'
      },
      {
        name: 'ATLAS Fact Sheet',
        href: getPathWithBase('/pdf-files/MITRE_ATLAS_Fact_Sheet.pdf')
      },
      {
        name: 'AI Security 101',
        to: '/resources/ai-security-101'
      },
      {
        name: 'AI Security for Autonomous Systems',
        to: '/resources/ai-security-autonomous-systems'
      },
      {
        name: 'SAFE-AI: AI Security Controls and Guidelines',
        to: '/resources/safe-ai'
      },
      {
        name: 'ATLAS Navigator',
        to: '/navigator'
      },
      {
        name: 'Contribute',
        to: '/resources/contribute'
      },
      {
        name: 'Updates',
        to: '/resources/updates'
      },
      {
        name: 'Upcoming Events',
        to: '/resources/events'
      },
      {
        name: 'Contact Us',
        to: '/resources/contact'
      }
    ]
  }
]

/**
 * Add the Header names and links
 * @returns {Object}
 */
const linksModded = computed(() => {
  // Add data object links
  const dataKeys = mainStore.getDataObjectTypes
  // Do not generate a route for case studies, which has its own defined templates
  const dynamicDataKeys = dataKeys.filter((k) => k !== 'case-studies')
  const dataLinks = dynamicDataKeys.map((objectType) => {
    return {
      name: `${dataObjectToPluralTitle(objectType)}`, // Plural version
      to: `/${dataObjectToPluralTitle(objectType, true)}` // Last word of the above
    }
  })

  // Sandwich data links between beginning and end links
  return linksBeginning.value.concat(dataLinks).concat(linksEnding)
})

const doesPageHaveSideNav = computed(() => {
  return (
    route.params.objectTypePlural ||
    (route.params.objectTypePlural && route.params.id) ||
    (route.path.startsWith('/studies') && route.path !== '/studies/create')
  )
})

function toggle() {
  mainStore.TOGGLE_NAV_DRAWER()
}
</script>
