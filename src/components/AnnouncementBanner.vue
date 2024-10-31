<template>
  <v-alert v-if="showBanner" closable icon="mdi-clipboard-check-outline" color="white" variant="tonal" max-width="100%" align="left">
    <span class="text-body-2">
      Please take our <a class="text-lightBlue font-weight-bold text-decoration-underline" href="https://forms.office.com/Pages/ResponsePage.aspx?id=SNwgxlAdUkmLOd9NVNdNgvUh6fWQs9dNlvXpIGCIYZhUMEtXUUlKSUtPNlJESDMyRTk1RlQzVzZVMyQlQCN0PWcu">
        ATLAS Feedback & Usage Survey</a> by Friday, Nov 22 to help us plan the future of ATLAS!
      <!-- <v-icon class="pa-5" slot="icon" color="info">
        mdi-security
      </v-icon> -->
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
