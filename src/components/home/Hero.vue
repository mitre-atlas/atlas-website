<template>
  <v-container fluid class="hero-image pa-0" align="center">
    <AnnoucementBanner />
    <v-container
      fluid
      class="home-panel d-flex flex-column flex-md-row justify-center justify-md-space-between align-center"
    >
      <h1
        class="tagline text-white text-h4 text-md-h2 text-lg-h1 font-weight-bold text-center text-md-start mt-3 mb-0 mx-4 mx-md-8"
      >
        Navigate threats to AI systems through
        <span class="text-highlighter">real-world insights</span>
      </h1>

      <div class="hero-actions d-flex flex-column align-center align-md-end mt-8 mt-md-0">
        <div class="hero-stats d-flex flex-wrap flex-md-nowrap justify-center justify-md-end mb-4">
          <matrix-stat
            v-for="stat in matrixStats"
            :key="stat.label"
            v-bind="stat"
            color="highlighter"
            class="hero-stat me-2 me-sm-4 me-md-6"
          ></matrix-stat>
        </div>
        <v-btn
          color="highlighter"
          variant="flat"
          :to="matrixRoute"
          append-icon="mdi-chevron-right"
          :size="buttonSize"
          class="hero-cta"
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

const matrixRoute = computed(() => {
  const version = store.getActiveNavigationVersion
  if (version) {
    return `/v/${encodeURIComponent(version)}/matrices/${store.getFirstMatrixId}`
  }
  return `/matrices/${store.getFirstMatrixId}`
})

const matrixStats = store.getDataObjectTypes.map((objType) => {
  return {
    label: objType.replace('-', ' '),
    value: store.getDataObjectsByType(objType).length,
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
    linear-gradient(90deg, rgba(var(--v-theme-navy), 0.85) 50%, rgba(var(--v-theme-navy), 0.5)),
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

.hero-actions {
  width: 100%;
}

.hero-stat {
  flex: 0 1 7rem;
}

.hero-cta {
  width: 100%;
}

@media (min-width: 960px) {
  .hero-actions,
  .hero-cta {
    width: auto;
  }

  .hero-stat {
    flex-basis: auto;
  }
}
</style>
