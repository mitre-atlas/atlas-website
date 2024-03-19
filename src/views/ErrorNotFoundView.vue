<template>
  <div class="text-center flex flex-center ma-10">
    <div>
      <div class="text-h1 font-weight-bold">
        404
      </div>

      <div class="text-h2 text-grey">
        Oops. Nothing here...
      </div>

      <v-btn class="mt-5" append-icon="mdi-home" text-color="blue" elevated outlined to="/" label="Go Home">Navigate Home</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { useMain } from "@/stores/main"

  const mainStore = useMain()

  onMounted(() => {
    mainStore.$state.pageNotFoundDisplaying = true
  })

  onUnmounted(() => {
    mainStore.$state.pageNotFoundDisplaying = false
  })
</script>
