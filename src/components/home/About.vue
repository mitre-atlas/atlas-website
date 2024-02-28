<template>
  <v-container class="home-panel">
    <v-row align="center" justify="center">
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-img src="@/assets/graphics/MITRE_ATLAS_logo_stacked.svg" max-height="150" :style="centerImageOnMoblile"></v-img>
          </v-card-title>
          <v-card-text>
            <div class="text-body-1 my-5">
              ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) is a globally
              accessible, living knowledge base of adversary tactics and techniques against
              Al-enabled svstems based on real-world attack observations and realistic
              demonstrations from Al red teams and security groups.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :class="centerButtonOnMobile"
              variant="outlined"
              href="https://atlas.mitre.org/pdf-files/MITRE_ATLAS_Fact_Sheet.pdf"
              append-icon="mdi-chevron-right"
              >Get the fact sheet</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <div class="text-h6">Quick Links</div>
          </v-col>
        </v-row>
        <v-row :class="verticalSepOnMobile">
          <!-- <iframe
            class="mx-auto"
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/3FN9v-y-C-w"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe> -->
          <v-col v-for="link in quickLinks" :key="link.title" cols="6">
            <v-btn :prepend-icon="link.icon" variant="text" class="text-capitalize" :size="linkSizeOnMobile" :to="link.link">{{ link.title }}</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

// About section
const centerButtonOnMobile = computed(() => (mdAndUp.value ? '' : ''))
const verticalSepOnMobile = computed(() => (mdAndUp.value ? '' : 'mt-10'))
const centerImageOnMoblile = computed(() => (mdAndUp.value ? '' : '{ width: unset !important; }'))
// Quick links
const linkSizeOnMobile = computed(() => (mdAndUp.value ? 'large' : 'small'))

const quickLinks = [
  {
    icon: 'mdi-account-circle',
    color: 'blue',
    title: 'Contact us',
    link: '/resources/contact',
  },
  {
    icon: 'mdi-school',
    color: 'blue',
    title: 'AI Security 101',
    link: '/resources/ai-security-101',
  },
  {
    icon: 'mdi-calendar',
    color: 'blue',
    title: 'Upcoming events',
    link: '/resources/events',
  },
  {
    icon: 'mdi-view-grid-plus',
    color: 'blue',
    title: 'See what\'s new',
    link: '/resources/updates',
  },
  {
    icon: 'mdi-file-download',
    color: 'blue',
    title: 'Get ATLAS Data',
    link: '/resources/info',
  },
  {
    icon: 'mdi-briefcase',
    color: 'blue',
    title: 'View case studies',
    link: '/studies',
  },
  {
    icon: 'mdi-flag',
    color: 'blue',
    title: 'View all tactics',
    link: '/tactics',
  },
  {
    icon: 'mdi-strategy',
    color: 'blue',
    title: 'View all techniques',
    link: '/techniques',
  },
  {
    icon: 'mdi-help',
    color: 'blue',
    title: 'Terminology and FAQ',
    link: '/resources/faq',
  }
]
</script>

<style scoped></style>
