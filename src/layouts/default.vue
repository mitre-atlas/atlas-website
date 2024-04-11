<template>
  <v-app>
    <Header />

    <SideNav v-if="doesPageHaveSideNav" />
    <v-main :class="`${isRouteFullView ? '' : 'mx-16 mb-16'}`">
      <BreadCrumbs />
      <slot />
      <ScrollToTopButton />
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
const name = 'Default'

import Footer from '@/components/footer/Footer.vue'
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const { VITE_MITRE_TITLE } = import.meta.env

// Set the page/tab title to ${title} | ${VITE_MITRE_TITLE} using page title from each individual view if it is given
useHead({
  titleTemplate: (pageTitle) =>
    pageTitle ? `${pageTitle} | ${VITE_MITRE_TITLE}` : VITE_MITRE_TITLE
})

const route = useRoute()

const doesPageHaveSideNav = computed(() => {
  return (
    ['tactics', 'techniques', 'mitigations', 'studies'].includes(route.params.objectTypePlural) ||
    (route.path.startsWith('/studies') && route.path !== '/studies/create')
  )
})

// Routes which should not have margins and padding around the content
const isRouteFullView = computed(() => {
  const routesWithNoMargins = ['/']
  return routesWithNoMargins.includes(route.path)
})
</script>
