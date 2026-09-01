<template>
  <div v-html="mdAsHtml" class="markdown-content"></div>
</template>

<script setup>
import { inject } from 'vue'

const md = inject('markdownit')

const { date } = defineProps({
  date: String,
})

// Get the contents of the specified update file
const module = await import(`../../public/content/update-files/${date}.md?raw`)

// Convert Markdown to HTML
const mdAsHtml = md.render(module.default)
</script>
