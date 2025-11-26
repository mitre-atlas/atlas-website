<template>
  <v-container class="px-0" fluid>
    <v-row class="matrix-image"></v-row>

    <v-row
      class="home-panel navy-container matrix-gradient text-white h-100"
      align="center"
      justify="center"
    >
      <v-container styling="padding-left: 0px; padding-right: 0px;">
        <v-row class="mx-1 mx-md-0">
          <v-col>
            <div :class="`text-${calloutTextSize}`">
              ATLAS is modeled after and complementary to
              <a href="https://attack.mitre.org/" target="_blank" class="text-lightBlue">MITRE ATT&CK®</a>, raising awareness of the rapidly
              evolving vulnerabilities of Al-enabled systems as
              they extend beyond cyber.
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
                :size="buttonSize"
                >Explore the ATLAS Threat Matrix</v-btn
              >
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import MatrixStat from '@/components/home/MatrixStat.vue'
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

const buttonSize = computed(() => (mdAndUp.value ? 'x-large' : undefined))
const calloutTextSize = computed(() => (mdAndUp.value ? 'h5' : 'h5'))
</script>

<style scoped>
.navy-container {
  background-color: rgb(var(--v-theme-navy));
}
.matrix-image {
  background:
  /* Bottom to top, matrix top fades into opaque */ linear-gradient(
      0deg,
      rgba(var(--v-theme-navy), 1),
      rgba(var(--v-theme-navy), 0.9) 20%,
      rgba(var(--v-theme-navy), 0.8) 30%,
      rgba(var(--v-theme-navy), 0.7) 40%,
      rgba(var(--v-theme-navy), 0) 80%
    ),
    url('@/assets/matrix.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  height: 18vw;
}
.matrix-gradient {
  /* Accomodates for matrix image on top */
  padding-top: 1em;
}
</style>
