<template>
    <div>
        <PageSectionTitle :pageTitle="title"/>
        
        <UpcomingEvents
          v-if="upcomingEvents.length > 0"
          :events="upcomingEvents"
          class="pt-5"
        />

        <PastEvents
          v-if="pastEvents.length > 0"
          :events="pastEvents"
          class="pt-5"
        />
    </div>
</template>
  
<script setup>
  import UpcomingEvents from "@/components/UpcomingEvents.vue"  
  import PastEvents from "@/components/PastEvents.vue"
  import PageSectionTitle from "@//components/PageSectionTitle.vue"

  import { ref } from 'vue'
  import { getPathWithBase } from '@/assets/tools.js'
  import jsyaml from 'js-yaml'

  // Set the title of the page (for tab title and to be displayed at the top of the page)
  const title = ref('Upcoming Events')

  const events = ref([])
  const upcomingEvents = ref([])
  const pastEvents = ref([])

  fetch(getPathWithBase('/content/events.yaml'))
    .then(response => response.text())
    .then(data => {
      events.value = jsyaml.load(data).data;
      // Convert the date field to a Date object
      events.value = events.value.map((event) => {
        event.date = new Date(event.date)
        return event
      })

      // Sort by date, oldest first
      events.value.sort((a, b) => a.date - b.date)
      // remove single \n, but keep \n\n
      // events.value = events.value.replace(/(?<!\n)\n(?!\n)/g, "");

      const currentDate = new Date()
      const currentIndex = events.value.findIndex((event) => event.date >= currentDate)
      // Past events are shown with most recent first
      pastEvents.value = events.value.slice(0, currentIndex).reverse()
      upcomingEvents.value = events.value.slice(currentIndex)
    })
    .catch(error => {
      console.error('Error fetching YAML file:', error);
    });

</script>