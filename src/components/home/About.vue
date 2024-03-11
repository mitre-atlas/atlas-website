<template>
  <v-container class="home-panel">
    <v-row align="center" justify="center">
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-img
              src="@/assets/graphics/MITRE_ATLAS_logo_stacked.svg"
              :max-height="imageMaxHeight"
              :style="centerImageOnMoblile"
            ></v-img>
          </v-card-title>
          <v-card-text>
            <div class="text-body-1 mt-5">
              ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) is a globally
              accessible, living knowledge base of adversary tactics and techniques against
              Al-enabled svstems based on real-world attack observations and realistic
              demonstrations from Al red teams and security groups.
            </div>
          </v-card-text>
          <v-card-actions style="justify-content: center">
            <v-btn
              variant="outlined"
              href="https://atlas.mitre.org/pdf-files/MITRE_ATLAS_Fact_Sheet.pdf"
              append-icon="mdi-chevron-right"
              >Get the fact sheet</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-row :class="verticalSepOnMobile">
          <v-col>
            <div class="text-h6 text-center">Quick Links</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="link in quickLinks" :key="link.title" cols="6">
            <v-btn
              :prepend-icon="link.icon"
              variant="outlined"
              :class="`text-none ${smAndUp ? 'text-body-1' : 'text-body-2'}`"
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

// About section
const imageMaxHeight = computed(() => (mdAndUp.value ? 150 : 100))
const verticalSepOnMobile = computed(() => (mdAndUp.value ? '' : 'mt-5'))
const centerImageOnMoblile = computed(() => (mdAndUp.value ? '' : '{ width: unset !important; }'))
// Quick links
const linkSizeOnMobile = computed(() => (mdAndUp.value ? 'large' : 'small'))

const quickLinks = [
  {
    icon: 'mdi-account-circle',
    title: 'Contact Us',
    link: '/resources/contact'
  },
  {
    icon: 'mdi-school',
    title: 'AI Security 101',
    link: '/resources/ai-security-101'
  },
  {
    icon: 'mdi-calendar',
    title: 'Upcoming events',
    link: '/resources/events'
  },
  {
    icon: 'mdi-file-download',
    title: 'Get ATLAS Data',
    link: '/resources/info'
  },
  {
    icon: 'mdi-help',
    title: 'Terminology and FAQ',
    link: '/resources/faq'
  },
  {
    icon: 'mdi-strategy',
    title: 'View all techniques',
    link: '/techniques'
  }
]
</script>

<style scoped></style>
