<template>
  <hero></hero>
  <about></about>
  <v-container fluid class="px-4 px-sm-6 px-md-10">
    <AtlasMatrix></AtlasMatrix>
  </v-container>
</template>

<script setup>
import Hero from '@/components/home/Hero.vue'
import About from '@/components/home/About.vue'
import AtlasMatrix from '@/components/matrix/AtlasMatrix.vue'
</script>
