<template>
  <div>
    <PageSectionTitle :pageTitle="title"/>
    <p>
      The {{ VITE_MITRE_TITLE }} version of the ATT&CK Navigator displays
      {{ VITE_SHORT_NAME }} techniques and allows users to create and view complex
      visualizations. In addition to the matrix, the Navigator also shows a
      frequency heat map of techniques used in {{ VITE_SHORT_NAME }} case studies.
      View the {{ VITE_SHORT_NAME }} Navigator below or at
      <a
        :href="VITE_NAVIGATION_URL"
        target="_blank"
      >{{ VITE_NAVIGATION_URL }} <v-icon size="x-small">mdi-open-in-new</v-icon></a>.
    </p>

    <p class="pt-5 mb-10">
      For more information on the standard ATT&CK Navigator and how to use it,
      visit the
      <a
        target="_blank"
        href="https://github.com/mitre-attack/attack-navigator"
      >project's GitHub page here</a>
      as well as watch a short
      <a
        target="_blank"
        href="https://www.youtube.com/watch?v=pcclNdwG8Vs."
      >demo video on YouTube</a>.
    </p>

    <div class="d-flex justify-center ">
      <v-progress-circular
        v-if="loading"
        color="primary"
        indeterminate
        :size="75"
        :width="12"
        class="mt-16"
      />
    </div>
    <iframe
      v-show="!loading"
      :src="`${VITE_NAVIGATION_URL}`"
      width="90%"
      height="700px"
      frameBorder="0"
      @load="loading = false"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import PageSectionTitle from "@//components/PageSectionTitle.vue"

  const { VITE_MITRE_TITLE, VITE_SHORT_NAME, VITE_NAVIGATION_URL } = import.meta.env
  const title = ref(VITE_SHORT_NAME + ' Navigator')

  const loading = ref(true)

</script>
