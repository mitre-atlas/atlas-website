<template>
    <div class="text-h3 my-5">
      {{ pageTitle }}
    </div>
  </template>

<script setup lang="ts">
    import { useHead } from '@unhead/vue'

    const { pageTitle } = defineProps({
    pageTitle: {
        type: String,
        required: true
    }
    })

    useHead({
        title: pageTitle
    })
</script>
