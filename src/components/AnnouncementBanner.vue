<template>
  <v-alert
    v-if="showBanner"
    closable
    icon="mdi-clipboard-account"
    color="white"
    variant="tonal"
    max-width="100%"
    align="left"
  >
    <span class="text-body-2">
      <!-- <v-icon class="pa-5" slot="icon" color="info">
        mdi-security
      </v-icon> -->
      MITRE is hiring
      <a
        class="text-lightBlue font-weight-bold text-decoration-underline"
        href="https://www.linkedin.com/posts/mitre-atlas_principal-ai-research-engineer-job-engineering-activity-7235300398008291330-wwuG"
      >
        AI security and research engineers!</a
      >
    </span>
  </v-alert>
</template>

<script setup>
/**
 * Header navigation bar, present on every page.
 * Included in the layout files.
 */

import { useMain } from '@/stores/main'
import { ref } from 'vue'

const mainStore = useMain()

const showBanner = ref(mainStore.getDoShowAnnoucementBanner)

const dismissAnnoucementBanner = () => {
  mainStore.dismissAnnoucementBanner()
  showBanner.value = false
}
</script>
