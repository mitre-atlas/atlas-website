<template>
  <v-card class="d-flex flex-column fill-height" :max-width="mdAndUp ? '400px' : ''">
    <a :href="url" target="_blank">
      <v-img :src="imageUrl" cover style="height: 200px" />
    </a>
    <v-card-title>
      <div :class="`text-${titleTextSize} text-wrap`">
        {{ title }}
      </div>
    </v-card-title>
    <v-card-subtitle> {{ formattedDate }} - {{ subtitle }} </v-card-subtitle>
    <v-card-text v-html="md.render(description)"></v-card-text>
    <div>
      <v-btn
        v-if="url"
        variant="flat"
        color="lightNavy"
        :href="url"
        target="_blank"
        append-icon="mdi-chevron-right"
        class="justify-start ms-4 mb-2"
      >
        Learn more
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { computed, inject } from 'vue'
const md = inject('markdownit')

import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

const titleTextSize = computed(() => (mdAndUp.value ? 'h4' : 'h6'))

const { imageSrc, title, subtitle, description, url, date } = defineProps({
  imageSrc: {
    type: String,
    default: 'network.jpeg'
  },
  title: String,
  subtitle: String,
  description: String,
  url: {
    type: String,
    default: null
  },
  date: {
    type: Date
  }
})

const formattedDate = computed(() => {
  return date.toLocaleDateString('default', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const imageUrl = computed(() => {
  return new URL(`../../assets/events/${imageSrc}`, import.meta.url).href
})
</script>
