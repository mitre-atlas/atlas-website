<template>
  <div> 
    <PageSectionTitle :pageTitle="title"/>
    <v-row>
      <v-col>
        <div v-html="updateInfo.content"></div>
      </v-col>
    </v-row>
  </div>
</template>


<script setup>
import PageSectionTitle from "@//components/PageSectionTitle.vue"
import { inject } from 'vue';
import { ref } from 'vue'
import { useRoute } from "vue-router";

import { capitalize } from '@/assets/tools.js'


const route = useRoute()
const { date } = route.params

const title = ref('Update:')

const md = inject('markdownit')

const updateInfo = ref({});

function getFilename(dateString) {
  // Split the input string into month and year
  const [monthString, yearString] = dateString.split(' ');

  // Get the month index (0-based) from the month string
  const monthIndex = new Date(`${monthString} 1, 2000`).getMonth();

  // Format the output string as "YYYY-MM.md"
  const formattedDate = `${yearString}-${(monthIndex + 1).toString().padStart(2, '0')}`;
  
  return formattedDate;
}

// Get path name of correct file
const filePath = `/public/content/update-files/${date}.md`

// Dynamically import Markdown
const modules = import.meta.glob(
  '@/../public/content/update-files/*.md',
  { as: 'raw', eager: true }
)

// Convert Markdown to HTML
const container = {};
const mdAsHtml = md.render(modules[filePath], container)

const data = {
  frontmatter: container.frontmatter,
  content: mdAsHtml
}

updateInfo.value = data

</script>
