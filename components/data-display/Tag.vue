<template>
  <div>
    <v-tooltip v-for="(tag, i) in sortedTags" :key="i" top>
      <template #activator="{ on, attrs }">
        <v-chip
          class="ma-1"
          label
          outlined
          small
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
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: [
    /**
     * String array represnting tags
     */
    'tags'
  ],
  data () {
    return {
      terms: []
    }
  },
  async fetch () {
    // Retrieve description list
    const categoryDescriptions = await this.$content('descriptions/categories').fetch()
    this.terms = categoryDescriptions.categories

    const lifecycleDescriptions = await this.$content('descriptions/ML-lifecycle').fetch()
    this.terms = this.terms.concat(lifecycleDescriptions['ML-lifecycle'])
    console.log(this.terms)
  },
  computed: {
    /**
     * Tags in alphabetical order
     */
    sortedTags () {
      // Make a copy as not to mutate prop
      return [...this.tags].sort()
    }
  },
  methods: {
    getTagDescription (name) {
      const matchingTerm = this.terms.find(t => t.name === name)
      if (matchingTerm) {
        return matchingTerm.description
      }

      // Not found
      return 'Definition not found'
    }
  }
}
</script>
