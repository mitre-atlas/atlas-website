<template>
  <v-container fluid align="center" justify="center" class="navy-container home-panel">
    <v-container>
      <v-row class="text-white">
        <v-col>
          <v-row>
            <div :class="`text-${calloutTextSize} text-${calloutJustification}`">
              Join our collaborative community to shape future tool and framework developments in AI
              security, threat mitigation, robustness, privacy and other critical aspects of AI assurance.
            </div>
          </v-row>
          <v-row :justify="`${calloutJustification}`" class="mt-5">
            <v-btn
              class="mt-5"
              variant="tonal"
              color="lightBlue"
              to="/resources/contact"
              append-icon="mdi-chevron-right"
              :size="buttonSize"
              >Connect with us</v-btn
            >
          </v-row>
        </v-col>
        <v-col :justify="missionJustification">
          <a href="https://www.mitre.org" class="text-white" style="display: inline-block">
            <v-img src="@/assets/MITRE_Mission_Vertical_White.svg" height="100px" width="150px" />
            www.mitre.org
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
// TODO account for left justification of other content
const missionJustification = computed(() => (mdAndUp.value ? 'center' : 'center'))
</script>

<style scoped>
.navy-container {
  background-color: rgb(var(--v-theme-navy));
}
</style>
