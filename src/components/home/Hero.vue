<template>
  <v-container fluid class="hero-image home-panel">
    <v-row align="center" justify="center" style="height: 100%">
      <v-col :cols="textColSize" :class="`text-white ${shouldTextCenter}`">
        <div :class="`text-${subtitleTextSize} mt-3`">
          <b class="tagline">Navigate threats to AI systems through  <span class="text-highlighter">real-world insights</span></b>
        </div>
      </v-col>

      <v-col align-self="end" :cols="buttonColSize" :class="`${shouldTextCenter} text-center`">
         <v-btn
          class=""
          color="highlighter"
          variant="flat"
          to="/matrices/ATLAS"
          append-icon="mdi-chevron-right"
          :size="buttonSize"
          >See the full ATLAS Matrix
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()


const textColSize = computed(() => (mdAndUp.value ? '7' : '12'))
const buttonColSize = computed(() => (mdAndUp.value ? '4' : '12'))
const buttonSize = computed(() => (mdAndUp.value ? 'x-large' : 'small'))
const shouldTextCenter = computed(() => mdAndUp.value ? 'ml-2' : 'text-center')
const subtitleTextSize = computed(() => (mdAndUp.value ? 'h1' : 'h4'))
</script>

<style scoped>
.hero-image {
  background:
    /* L to R */
    linear-gradient(90deg, rgba(var(--v-theme-navy), 0.85) 40%, rgba(var(--v-theme-navy), 0.05)),
    /*Top to Bottom, to align hero top color to app bar*/
    linear-gradient(rgba(var(--v-theme-navy), 0.9), rgba(var(--v-theme-navy), 0.1) 15%),
    url('@/assets/GettyImages-1178228880.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

}

.tagline {
  font-family: 'TradeGothicBold'
}
</style>
