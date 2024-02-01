<template>
  <v-container class="home-panel">
    <v-row>
      <div class="text-h3 mb-10">News and Resources</div>
    </v-row>
    <v-row>
      <v-col v-for="event in events" :key="event.name" cols="4">
        <news-card
          :title="event.name"
          :subtitle="event.location"
          :description="event.description"
          :url="event.url"
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
  })
  .catch((error) => {
    console.error('Error fetching YAML file:', error)
  })

const items = [
  {
    imageSrc: 'https://www.ncsi.com/wp-content/uploads/2023/09/CDAO-Advantage2024-1920x470-1-1.png',
    title: 'Advantage DoD 2024'
  }
]
</script>
