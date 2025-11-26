<template>
  <v-container fluid align="center" justify="center" class="navy-container home-panel">
    <v-container>
      <v-row class="text-white ga-10">
        <v-col cols="12" md="4">
          <v-row class="px-md-0 px-1">
            <div :class="`text-${calloutTextSize} text-${calloutJustification}`">
              Join our collaborative community to shape future tool and framework developments in AI
              security, threat mitigation, robustness, privacy and other critical aspects of AI assurance.
            </div>
          </v-row>
          <v-row :justify="calloutJustification" class="mt-5">
            <v-btn
              class="mt-5"
              variant="flat"
              color="info"
              to="/resources/contact"
              append-icon="mdi-chevron-right"
              :size="buttonSize"
              >Connect with us</v-btn
            >
          </v-row>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="auto">
          <a href="https://www.mitre.org" class="text-white">
            <v-img src="@/assets/mitre-logo-white.svg" height="80" width="320" />
            <div style="text-transform: capitalize; max-width: 130px;">Pioneering For A Better Future</div>
            <div>www.mitre.org</div>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const buttonSize = computed(() => (mdAndUp.value ? 'x-large' : undefined))
const calloutTextSize = computed(() => (mdAndUp.value ? 'h5' : 'h5'))
const calloutJustification = computed(() => (mdAndUp.value ? 'start' : 'center'))

</script>

<style scoped>
.navy-container {
  background-color: rgb(var(--v-theme-navy));
}
</style>
