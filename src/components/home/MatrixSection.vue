<template>
  <v-container fluid class="home-panel">
    <v-row class="text-white h-100" align="center" justify="center">
      <v-col>
        <div :class="`text-${calloutTextSize} ma-10`">
          ATLAS is modeled after and complementary to
          <span class="text-lightBlue">MITRE ATT&CK®</span>, raising awareness of the rapidly
          evolving vulnerabilities of <span class="text-lightBlue">Al-enabled systems</span> as they
          extend beyond cyber.
        </div>
      </v-col>

      <v-col>
        <v-row class="mb-10">
          <v-col v-for="stat in matrixStats" :key="stat.label" :cols="mdAndUp ? '3' : '6'">
            <matrix-stat v-bind="stat"></matrix-stat>
          </v-col>
        </v-row>

        <v-row justify="center" class="mt-10">
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

const calloutTextSize = computed(() => (mdAndUp.value ? 'h4' : 'h5'))
const statLabelSize = computed(() => (mdAndUp.value ? 'subtitle-1' : 'subtitle-1'))
</script>

<style scoped>
.v-container {
  background-color: rgb(var(--v-theme-navy));
}
</style>
