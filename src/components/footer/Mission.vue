<template>
  <v-container fluid align="center" justify="center" class="navy-container">
  <v-container>
    <v-row class="my-16 text-white">
      <v-col>
        <v-row>
         <div :class="`text-${calloutTextSize} text-${justification}`">
          Join our collaborative community to shape future tool and framework developments in AI security, threat mitigation, bias, privacy and other critical aspects of AI assurance.
        </div>
        </v-row>
        <v-row :justify="`${justification}`" class="mt-5">
          <v-btn
            class="mt-5"
            variant="tonal"
            color="lightBlue"
            to="/resources/contact"
            append-icon="mdi-chevron-right"
            size="x-large"
            >Connect with us</v-btn
          >
        </v-row>
      </v-col>
      <v-col justify="center">
        <v-img src="@/assets/MITRE_Mission_Vertical_White.svg" height="100px"></v-img>
        <a href="https://www.mitre.org" class="text-white text-body-1">www.mitre.org</a>
      </v-col>
    </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const calloutTextSize = computed(() => (mdAndUp.value ? 'h5' : 'h5'))
const justification = computed(() => (mdAndUp.value ? 'left' : 'center'))
</script>

<style scoped>
.navy-container {
  background-color: rgb(var(--v-theme-navy));
}
</style>