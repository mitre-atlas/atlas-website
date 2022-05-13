<template>
  <div>
    <page-title>{{ title }}</page-title>

    <p>
      The {{ shortName }} Matrix below shows the progression of tactics used in attacks as columns from left to right,
      with ML techniques belonging to each tactic below. Click on links to learn more about each item, or view
      {{ shortName }} tactics and techniques using the links at the top navigation bar.
    </p>

    <v-row class="mt-10">
      <matrix-attack-style :matrix="getMatrix" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    title: `${name.short} Matrix`,
    mitreTitle: name.mitre
  }),
  computed: {
    ...mapGetters('matrix', ['getMatrix'])
  },
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
</style>
