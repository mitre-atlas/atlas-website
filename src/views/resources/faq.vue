
<template>
  <div class="pa-7 text-left"> 
    <div class="text-h3">{{ title }}</div>

    <div class="pl-4" v-for="(section, index) in Object.entries(faqSections)" :key="index">
      <div class="pt-7 pb-2 text-h6"> {{ sectionTitles[index] }} </div>
      <component class="pb-8 text-body-1" :is="section[1].default"></component>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const faqSections = ref([]);
const sectionTitles = ref([]);
const title = 'FAQ'

async function importFiles() {
  const fileNames = Object.keys(
    import.meta.glob('@/../public/content/faq-files/*.md')
  );

  for (const fileName of fileNames) {
    try {
      const markdownContent = await import( /* @vite-ignore */ fileName);
      sectionTitles.value.push(markdownContent.frontmatter.title)
      faqSections.value.push(markdownContent);
    } catch (error) {
      console.error(`Error importing ${fileName}:`, error);
    }
  }
}

// Call importFiles on component mount
onMounted(async () => {
  importFiles();
});
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
