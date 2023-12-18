
<template>
  <div class="pa-7 text-left"> 
    <div class="text-h3">{{ title }}</div>

    <div class="pl-4" v-for="section in faqSections" :key="section.frontmatter.title">
      <div class="pt-7 pb-2 text-h6"> {{ section.frontmatter.title }} </div>
      <component class="pb-8 text-body-1" :is="section.default"></component>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const faqSections = ref([]);
const title = 'FAQ'

async function importFiles() {
  // Get all names of files in the FAQ md folder
  const fileNames = Object.keys(
    import.meta.glob('@/../public/content/faq-files/*.md')
  );

  // Collect markdown content from each file
  for (const fileName of fileNames) {
    try {
      const markdownContent = await import( /* @vite-ignore */ fileName);
      faqSections.value.push(markdownContent);
    } catch (error) {
      console.error(`Error importing ${fileName}:`, error);
    }
  }
}

importFiles();

</script>

<style>

th, td {
  border-bottom-width: 1px !important;
  border-bottom-style: solid !important;
  border-bottom-color: rgba(0,0,0,.12) !important;
  padding: 5px;
  padding-left: 0 !important;
}

table {
  padding-top: 10px;
}

</style>
