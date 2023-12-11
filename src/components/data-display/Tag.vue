<template>
    <span>
      <v-tooltip v-for="(tag, i) in sortedTags" :key="i" top> 
         <template #activator="{ on, attrs }">
          <v-chip
            class="text-left pa-0"
            density="compact"
            variant="text"
            v-bind="attrs"
            v-on="on"
          >
            {{ tag }}
          </v-chip>
        </template>
        <span class="text-caption">
          {{ getTagDescription(tag) }}
        </span>
      </v-tooltip>
    </span>
  </template>
  
  <script>
    import { computed } from 'vue';
    
    const { tags } = defineProps([
      /**
       * String array represnting tags
       */
      'tags'
    ]);
    const terms = []
  
    // TODO: get category descriptions from content
    // let async fetch = () => {
    //   // Retrieve description list
    //   const categoryDescriptions = await $content('descriptions/categories').fetch()
    //   terms = categoryDescriptions.categories
  
    //   const lifecycleDescriptions = await $content('descriptions/ML-lifecycle').fetch()
    //   terms = terms.concat(lifecycleDescriptions['ML-lifecycle'])
  
    // }
  
    /**
     * Tags in alphabetical order
     */
    let sortedTags = computed(() => {
      // Make a copy as not to mutate prop
      return tags.sort()
    })
  
    let getTagDescription = (name) => {
      const matchingTerm = terms.find(t => t.name === name)
      if (matchingTerm) {
        return matchingTerm.description
      }
  
      // Not found
      return 'Definition not found'
    }
    
  
  </script>
  