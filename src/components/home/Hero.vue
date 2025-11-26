<template>
  <v-container fluid class="hero-image pa-0" align="center">
    <AnnoucementBanner />
    <v-container fluid class="home-panel" align="left">
      <v-row align="center" justify="center" style="height: 100%">
        <v-col :class="`text-white text-center text-lg-left`" lg="6" cols="12">
          <div :class="`text-h4 text-md-h2 text-lg-h1 mt-3`">
            <b class="tagline"
              >Navigate threats to AI systems through
              <span class="text-highlighter">real-world insights</span></b
            >
          </div>
        </v-col>

        <v-col align-self="end" lg="5" cols="12" :class="`text-lg-right text-center`">
          <v-btn
            color="highlighter"
            variant="flat"
            to="/matrices/ATLAS"
            append-icon="mdi-chevron-right"
            :size="buttonSize"
            >Explore the ATLAS Threat Matrix
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

import AnnoucementBanner from '@/components/AnnouncementBanner.vue'

const { mdAndUp } = useDisplay()

const buttonSize = computed(() => (mdAndUp.value ? 'x-large' : undefined))

</script>

<style scoped>
.hero-image {
  background:
    /* L to R */
    linear-gradient(90deg, rgba(var(--v-theme-navy), 0.85) 40%, rgba(var(--v-theme-navy), 0.05)),
    /*Top to Bottom, to align hero top color to app bar*/
      linear-gradient(rgba(var(--v-theme-navy), 0.9), rgba(var(--v-theme-navy), 0.1) 15%),
    url('@/assets/GettyImages-1178228880-small.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.tagline {
  font-family: 'TradeGothicBold';
}
</style>
