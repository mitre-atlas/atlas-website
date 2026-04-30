<template>
  <v-container class="home-panel" style="max-width: 750px">
    <v-row align="center" justify="center">
      <v-col>
        <v-card flat>
          <v-card-title class="d-flex ga-5 justify-center">
            <v-img src="@/assets/graphics/MITRE_Atlas_logo.svg" max-width="80px"></v-img>
            <v-img src="@/assets/graphics/MITRE_ATLAS_dark.svg" max-width="400px"></v-img>
          </v-card-title>
          <v-card-text>
            <div class="text-mediumNavy text-justify" style="font-size: 16px; margin-top: 40px">
              ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) is a globally
              accessible, living knowledge base of adversary tactics and techniques against
              Al-enabled systems based on real-world attack observations and realistic
              demonstrations from Al red teams and security groups.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col>
        <v-row>
          <v-col>
            <div class="text-center text-mediumNavy" style="font-size: 18px">
              Ready to Learn More?
            </div>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col v-for="link in quickLinks" :key="link.title" :cols="linkColumnsOnMobile">
            <v-btn
              :prepend-icon="link.icon"
              rounded="xl"
              variant="outlined"
              :density="densityOnMobile"
              :class="`text-none text-mediumNavy ${smAndUp ? 'text-body-1' : 'text-body-2'}`"
              :size="linkSizeOnMobile"
              :to="link.link"
              block
              >{{ link.title }}</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndUp, mdAndUp } = useDisplay()

// Quick links
const linkSizeOnMobile = computed(() => (mdAndUp.value ? 'large' : 'small'))
const linkColumnsOnMobile = computed(() => (mdAndUp.value ? 3 : 7))
const densityOnMobile = computed(() => (mdAndUp.value ? 'compact' : 'default'))

const quickLinks = [
  {
    icon: 'mdi-database',
    title: 'ATLAS Data',
    link: '/resources/info'
  },
  {
    icon: 'mdi-school',
    title: 'AI Security 101',
    link: '/resources/ai-security-101'
  },
  {
    icon: 'mdi-help-circle',
    title: 'ATLAS Glossary',
    link: '/resources/glossary'
  }
]
</script>

<style scoped></style>
