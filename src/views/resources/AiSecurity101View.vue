<template>
  <div>
    <PageSectionTitle :pageTitle="title" />
    <div v-html="mdAsHtml" class="mx-10"></div>
  </div>
</template>

<script setup>
import MarkdownContent from '@/../public/content/ai-security-101.md?raw'
import PageSectionTitle from '@/components/PageSectionTitle.vue'
import { inject } from 'vue'
import { ref } from 'vue'

const md = inject('markdownit')

// Render each file's contents into HTML
// Frontmatter is parsed out into `frontmatter`
const container = {}
const mdAsHtml = md.render(MarkdownContent, container)
const title = ref(container.frontmatter.title)
</script>

<style scoped>
:deep(table),
:deep(th),
:deep(td) {
  border: 1px solid black;
  border-collapse: collapse;
}
:deep(th),
:deep(td) {
  padding: 0.5rem;
}
</style>
