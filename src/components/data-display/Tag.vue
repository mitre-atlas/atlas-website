<template>
    <span>
      <v-tooltip v-for="(tag, i) in tags" :key="i" :text="getTagDescription(tag)" location="top">
        <template v-slot:activator="{ props }">
          <!-- <v-btn v-bind="props">Tooltip</v-btn> -->
          <v-chip
            class="ma-1"
            density="compact"
            variant="outlined"
            label
            v-bind="props"
          >
            {{ tag }}
          </v-chip>
        </template>
      </v-tooltip>
    </span>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import jsyaml from 'js-yaml';
    
    const { tags } = defineProps([
      /**
       * String array represnting tags
       */
      'tags'
    ]);

    const terms = ref([])

    getYaml()

    async function getYaml() {
      try {
          const categoriesResponse = await fetch('/content/descriptions/categories.yaml')
          const categories = await categoriesResponse.text()
          terms.value = jsyaml.load(categories).categories

          const lifecycleResponse = await fetch('/content/descriptions/ML-lifecycle.yaml')
          const lifecycles = await lifecycleResponse.text()
          terms.value = terms.value.concat(jsyaml.load(lifecycles)['ML-lifecycle'])
      } catch (error) {
          console.error('Error fetching YAML file:', error)
      }
    }
  
    function getTagDescription(name) {
      const matchingTerm = terms.value.find(t => t.name === name)
      if (matchingTerm) {
        return matchingTerm.description
      }
  
      // Not found
      return 'Definition not found'
    }
    
  
  </script>
  