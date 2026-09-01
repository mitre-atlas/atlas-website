<template>
  <div class="text-center flex flex-center ma-4 ma-sm-10">
    <div>
      <h1 class="text-h2 text-sm-h1 font-weight-bold ma-0">404</h1>

      <div class="text-h4 text-sm-h2 text-grey">Oops. Nothing here...</div>
      <div v-if="mainStore.dataLoadError" class="text-body-1 text-grey-darken-1 mt-2">
        {{ mainStore.dataLoadError }}
      </div>

      <v-btn
        class="mt-5"
        append-icon="mdi-home"
        text-color="blue"
        elevated
        outlined
        :to="homeRoute"
        label="Go Home"
        >Navigate Home</v-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useMain } from '@/stores/main'

const mainStore = useMain()

const homeRoute = computed(() => {
  return '/'
})

onMounted(() => {
  mainStore.$state.pageNotFoundDisplaying = true
})

onUnmounted(() => {
  mainStore.$state.pageNotFoundDisplaying = false
})
</script>
