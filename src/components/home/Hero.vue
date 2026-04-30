<template>
  <v-container fluid class="hero-image pa-0" align="center">
    <AnnoucementBanner />
    <v-container fluid class="home-panel d-flex justify-space-between align-center">
      <div class="text-white text-h4 text-md-h2 text-lg-h1 mt-3 ms-8 me-8">
        <b class="tagline">
          Navigate threats to AI systems through
          <span class="text-highlighter">real-world insights</span>
        </b>
      </div>

      <div class="d-flex flex-column align-end">
        <div class="d-flex mb-4">
          <matrix-stat
            v-for="stat in matrixStats"
            :key="stat.label"
            v-bind="stat"
            color="highlighter"
            class="me-6"
          ></matrix-stat>
        </div>
        <v-btn
          color="highlighter"
          variant="flat"
          to="/matrices/ATLAS"
          append-icon="mdi-chevron-right"
          :size="buttonSize"
          >Explore the ATLAS Threat Matrix
        </v-btn>
      </div>
    </v-container>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

import AnnoucementBanner from '@/components/AnnouncementBanner.vue'
import MatrixStat from '@/components/home/MatrixStat.vue'
import { useMain } from '@/stores/main'

const { mdAndUp } = useDisplay()

const store = useMain()

const matrixStats = store.getDataObjectTypes.map((objType) => {
  return {
    label: objType.replace('-', ' '),
    value: store.getDataObjectsByType(objType).length
  }
})

if (matrixStats.length > 1 && matrixStats[0].label === 'case studies') {
  matrixStats.push(matrixStats.shift())
}

const buttonSize = computed(() => (mdAndUp.value ? 'x-large' : undefined))
</script>

<style scoped>
.hero-image {
  background:
    /* L to R */
    linear-gradient(90deg, rgba(var(--v-theme-navy), 0.85) 50%, rgba(var(--v-theme-navy), 0.50)),
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
