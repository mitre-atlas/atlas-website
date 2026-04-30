<template>
  <hero></hero>
  <about></about>
  <v-container fluid class="px-10">
    <AtlasMatrix></AtlasMatrix>
  </v-container>
</template>

<script setup>
import Hero from '@/components/home/Hero.vue'
import About from '@/components/home/About.vue'
import AtlasMatrix from '@/components/matrix/AtlasMatrix.vue'
</script>
