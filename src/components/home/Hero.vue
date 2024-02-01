<template>
  <v-container fluid class="hero-image home-panel">
    <v-row align="center" justify="center" style="height: 100%">
      <v-col cols="2" class="ml-5">
        <v-img src="@/assets/atlas-graphic-white.png"></v-img>
      </v-col>

      <v-col cols="7" class="text-white">
        <div :class="`text-${titleTextSize} font-weight-medium`">MITRE ATLAS™</div>

        <div :class="`text-${subtitleTextSize} text-uppercase mt-3`">
          <span class="text-lightBlue"> Navigating </span>
          the landscape of threats to machine learning systems
        </div>
      </v-col>

      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const titleTextSize = computed(() => (mdAndUp.value ? 'h1' : 'h3'))
const subtitleTextSize = computed(() => (mdAndUp.value ? 'h4' : 'h6'))
</script>

<style scoped>
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
</style>
