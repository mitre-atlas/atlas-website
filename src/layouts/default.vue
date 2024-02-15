<template>
  <v-app>
      <Header />

      <SideNav v-if="doesPageHaveSideNav" />
      <v-main :class="`${isRouteFullView ? '' : 'ma-16 pt-16'}`" >
          <slot />
      </v-main>

      <Footer />
  </v-app>
</template>

<script setup>
  const name = "Default";

  import Footer from '@/components/footer/Footer.vue'
  import Header from '@/components/Header.vue'
  import SideNav from '@/components/SideNav.vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useHead } from '@unhead/vue'

  const { VITE_MITRE_TITLE } = import.meta.env

  // Set the page/tab title to ${title} | ${VITE_MITRE_TITLE} using page title from each individual view if it is given
  useHead({
    titleTemplate: (pageTitle) => pageTitle ? `${pageTitle} | ${VITE_MITRE_TITLE}` : VITE_MITRE_TITLE,
  })


  const route = useRoute()

  const doesPageHaveSideNav = computed(() => {
    return ['tactics', 'techniques', 'mitigations', 'studies'].includes(route.params.objectTypePlural) ||
      (!route.params.objectTypePlural && route.params.id)
  })

  // Routes which should not have margins and padding around the content
  const isRouteFullView = computed(() => {
    const routesWithNoMargins = [
      '/',
      '/redesign'
    ]
    return routesWithNoMargins.includes(route.path)
  });


  </script>

  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  </style>

