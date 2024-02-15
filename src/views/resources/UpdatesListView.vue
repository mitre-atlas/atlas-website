<template>
  <div> 
    <PageSectionTitle :pageTitle="title"/>
    <v-row>
      <v-col :cols="`${mdAndUp ? 2 : 12}`">
        <UpdatesTable :updates="updateSections"/>
      </v-col>
      <v-col cols="10">
        <div class="pr-8" v-html="mostRecentUpdate.value"></div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import PageSectionTitle from "@/components/PageSectionTitle.vue"
import UpdatesTable from "@//components/UpdatesTable.vue"
import { inject, reactive } from 'vue';
import { ref } from 'vue'
import { getLatestUpdateDate } from '@/assets/tools.js'
import { useDisplay } from 'vuetify'

// mobile boolean for contitional rendering
const { mdAndUp } = useDisplay()

const title = ref('Updates')

const md = inject('markdownit')

const updateSections = reactive([]);

const mostRecentUpdate =  ref({})

function sortUpdates(updateObjs) {
  // Sort the updateObjs by date
  return Object.keys(updateObjs).sort((a, b) => b.localeCompare(a)).reduce(
    (obj, key) => { 
      obj[key] = updateObjs[key]; 
      return obj;
    }, 
    {}
);

}

// Dynamically import any Markdown files found
const modules = sortUpdates(import.meta.glob(
  '@/../public/content/update-files/*.md',
  { as: 'raw', eager: true }
))

const datePatternTitle = /(\w+ \d{4})/; // Regular expression to match the MonthName YYYY date pattern in the markdown
const datePatternFilename = /(\d{4}-\d{2})/; // Regular expression to match the YYYY-MM date pattern in the filename

Object.keys(sortUpdates(modules)).map((m) => {
  // Get neccesary information for each update (date, route)
  const container = {};
  const extractedDate = modules[m].match(datePatternTitle)[0]; // Extract the date from the markdowncontents
  const route = "updates/" + m.match(datePatternFilename)[0]

  const data = {
    date: extractedDate.substring(0, 3) + " " + extractedDate.substring(extractedDate.length - 4),
    route: route
  }

  // Set mostRecentUpdate's markdown (to display on this page)
  if (extractedDate == getLatestUpdateDate()) {
    const mdAsHtml = md.render(modules[m], container)
    mostRecentUpdate.value = ref(mdAsHtml)
  }

  updateSections.push(data)
})
</script>
