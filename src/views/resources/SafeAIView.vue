<template>
  <div>
    <PageSectionTitle :pageTitle="title" />
    <div v-html="mdAsHtml" class="mx-10"></div>
  </div>
</template>

<script setup>
import MarkdownContent from '@/../public/content/safe-ai.md?raw'
import PageSectionTitle from '@/components/PageSectionTitle.vue'
import { inject, ref } from 'vue'

const md = inject('markdownit')

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
