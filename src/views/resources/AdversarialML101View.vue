
<template>
  <div> 
    <PageSectionTitle :pageTitle="title"/>
    <MarkdownContent class="pa-4 text-body-1"></MarkdownContent>
  </div>
</template>

<script setup>
  import MarkdownContent from "@/../public/content/adversarial-ml-101.md"
  import PageSectionTitle from "@//components/PageSectionTitle.vue"

  import { ref } from 'vue'
  const title = ref('Adversarial Machine Learning 101')

</script>
