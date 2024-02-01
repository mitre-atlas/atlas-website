<template>
  <v-card max-width="400px">
    <v-img :src="imageSrc" height="200px" cover></v-img>
    <v-card-title>
      <div class="text-h4">
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
