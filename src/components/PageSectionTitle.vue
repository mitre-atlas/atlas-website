<template>
  <h1 class="text-h4 text-sm-h3 my-5">
    {{ pageTitle }}
  </h1>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'

const { pageTitle } = defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
})

useHead({
  title: pageTitle,
})
</script>
