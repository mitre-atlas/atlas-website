<template>
  <v-container fluid class="home-panel navy-container text-white matrix-image">
    <v-container>
    <v-row class="text-white h-100" align="center" justify="center">
      <v-col>
        <div :class="`text-${calloutTextSize}`">
          ATLAS is modeled after and complementary to
          <span class="text-lightBlue">MITRE ATT&CK®</span>, raising awareness of the rapidly
          evolving vulnerabilities of <span class="text-lightBlue">Al-enabled systems</span> as they
          extend beyond cyber.
        </div>
      </v-col>

      <v-col>
        <v-row class="mb-5">
          <v-col v-for="stat in matrixStats" :key="stat.label" :cols="mdAndUp ? '3' : '6'">
            <matrix-stat v-bind="stat"></matrix-stat>
          </v-col>
        </v-row>
         <v-row justify="center" class="mt-5">
          <v-btn
            class=""
            variant="tonal"
            to="/matrices/ATLAS"
            append-icon="mdi-chevron-right"
            size="x-large"
            >See the full ATLAS Matrix</v-btn
          >
        </v-row>
      </v-col>
    </v-row>

    </v-container>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import MatrixStat from '@/components/home/MatrixStat.vue'
import AtlasMatrix from '@/components/matrix/AtlasMatrix.vue';
import { useMain } from '@/stores/main'
const store = useMain()

// Compute stats
let matrixStats = store.getDataObjectTypes.map((objType) => {
  return {
    // Format for display
    label: objType.replace('-', ' '),
    // Number of objects
    value: store.getDataObjectsByType(objType).length
  }
})

// Ensure that case studies is at the end to preseve ordering of tactics, techniques ,... case studies
if (matrixStats.length > 1 && matrixStats[0].label === 'case studies') {
  matrixStats.push(matrixStats.shift())
}

// Responsive
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const calloutTextSize = computed(() => (mdAndUp.value ? 'h5' : 'h5'))
const statLabelSize = computed(() => (mdAndUp.value ? 'subtitle-1' : 'subtitle-1'))
</script>

<style scoped>
.navy-container {
  background-color: rgb(var(--v-theme-navy));
}
.hero-image {
  background:
    /* L to R */
    linear-gradient(90deg, rgba(var(--v-theme-navy), 0.85) 40%, rgba(var(--v-theme-navy), 0.05)),
    /*Top to Bottom, to align hero top color to app bar*/
      linear-gradient(rgba(var(--v-theme-navy), 0.9), rgba(var(--v-theme-navy), 0.1) 15%),
    url('@/assets/network.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
}
.matrix-image {
  background:
  /* Top to bottom, reveal of matrix top, fade into opaque */
    linear-gradient(rgba(var(--v-theme-navy), 0.7),  rgba(var(--v-theme-navy), 1) 50%),
    url('@/assets/matrix.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>