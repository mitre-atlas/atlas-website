
<template>
  <div class="pa-7"> 
    <div class="text-h3">{{ title }}</div>
    <MarkdownContent class="pa-4 text-body-1"></MarkdownContent>
  </div>
</template>

<script setup>
import MarkdownContent from "@/../public/content/adversarial-ml-101.md"
const title = 'Adversarial Machine Learning 101'

</script>
