<template>
  <v-container class="home-panel">
    <v-row>
      <v-col>
        <div class="text-h4 mb-10">News and Resources</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="event in events" :key="event.name" cols="12" md="4">
        <news-card
          :title="event.name"
          :subtitle="event.location"
          :description="event.description"
          :url="event.url"
          :imageSrc="event.imageSrc"
          :date="event.date"
        ></news-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import jsyaml from 'js-yaml'
import NewsCard from './NewsCard.vue'
import { getPathWithBase } from '@/assets/tools.js'

const events = ref([])

fetch(getPathWithBase('/content/events.yaml'))
  .then((response) => response.text())
  .then((data) => {
    events.value = jsyaml.load(data).data
    // Convert the date field to a Date object
    events.value = events.value.map((event) => {
      event.date = new Date(event.date)
      return event
    })

    // Sort by date, newest first
    events.value.sort((a, b) => b.date - a.date)

    // Take the most recent
    events.value = events.value.slice(0, 3)

    // Sort by date, oldest first
    events.value.sort((a, b) => a.date - b.date)
  })
  .catch((error) => {
    console.error('Error fetching YAML file:', error)
  })
</script>
