<template>
  <v-card max-width="400px">
    <v-img :src="imageSrc" height="200px" cover></v-img>
    <v-card-title>
      <div :class="`text-${titleTextSize}`">
        {{ title }}
      </div>
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text>
      {{ description }}
    </v-card-text>
    <v-card-actions v-if="url">
      <v-btn class="" variant="text" :href="url" append-icon="mdi-chevron-right">Learn more</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const titleTextSize = computed(() => (mdAndUp.value ? 'h4' : 'h5'))

const { imageSrc, title, subtitle, description, url } = defineProps({
  imageSrc: {
    type: String,
    default: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
  },
  title: String,
  subtitle: String,
  description: String,
  url: {
    type: String,
    default: null
  }
})
</script>
