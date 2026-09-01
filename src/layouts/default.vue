<template>
  <v-app>
    <template v-if="isErrorRoute">
      <Header />
      <v-main class="mx-4 mx-sm-6 mx-md-16 mb-16">
        <slot />
      </v-main>
      <Footer />
    </template>
    <template v-else>
      <Header />
      <SideNav v-if="doesPageHaveSideNav" />
      <v-main :class="layoutMainClass">
        <BreadCrumbs v-if="showBreadcrumbs" />
        <slot />
        <ScrollToTopButton />
      </v-main>

      <Footer />
    </template>
  </v-app>
</template>

<script setup>
import Footer from '@/components/footer/Footer.vue'
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'
import { MITRE_TITLE } from '@/config/env'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

// Set the page/tab title to ${title} | ${MITRE_TITLE} using page title from each individual view if it is given
useHead({
  titleTemplate: (pageTitle) => (pageTitle ? `${pageTitle} | ${MITRE_TITLE}` : MITRE_TITLE),
})

const route = useRoute()

const routeMeta = computed(() => route.meta || {})

const isErrorRoute = computed(() => {
  return routeMeta.value.section === 'error'
})

const doesPageHaveSideNav = computed(() => {
  const metaValue = routeMeta.value.showSideNav
  if (typeof metaValue === 'boolean') {
    return metaValue
  }

  return false
})

const isRouteFullView = computed(() => {
  const metaValue = routeMeta.value.fullWidth
  if (typeof metaValue === 'boolean') {
    return metaValue
  }

  return false
})

const showBreadcrumbs = computed(() => {
  const metaValue = routeMeta.value.showBreadcrumbs
  if (typeof metaValue === 'boolean') {
    return metaValue
  }

  return !isRouteFullView.value
})

const layoutMainClass = computed(() => {
  return isRouteFullView.value ? '' : 'mx-4 mx-sm-6 mx-md-16 mb-16'
})
</script>
