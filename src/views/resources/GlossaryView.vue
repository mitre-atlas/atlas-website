<template>
  <div>
    <PageSectionTitle :pageTitle="title" />

    <div v-for="(section, i) in glossarySections" :key="i">
      <div class="text-h5 mt-10 mb-5">
        {{ section.frontmatter.title }}
      </div>
      <div v-html="section.content"></div>
    </div>
  </div>
</template>

<script setup>
import PageSectionTitle from '@//components/PageSectionTitle.vue'
import { inject, reactive } from 'vue'
import { ref } from 'vue'

const title = ref('ATLAS Glossary')

const md = inject('markdownit')

const glossarySections = reactive([])

// Dynamically import any Markdown files found
const modules = import.meta.glob('@/../public/content/glossary-files/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

// Convert Markdown to HTML
Object.values(modules).map((m) => {
  // Render each file's contents into HTML
  // Frontmatter is parsed out into `frontmatter`
  const container = {}
  const mdAsHtml = md.render(m, container)

  const data = {
    frontmatter: container.frontmatter,
    content: mdAsHtml
  }

  glossarySections.push(data)
})

// Reorder the sections ascending according to the `weight` frontmatter, if exists
glossarySections.sort((a, b) => {
  if ('weight' in a.frontmatter && 'weight' in b.frontmatter) {
    // Lower weight at the top
    return a.frontmatter.weight - b.frontmatter.weight
  } else if ('title' in a.frontmatter && 'title' in b.frontmatter) {
    // Sort alphabetically by title, if exists
    return a.frontmatter.title.localeCompare(b.frontmatter.title)
  }
  // Default sort
  return a - b
})
</script>
