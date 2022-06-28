<template>
  <div>
    <data-side-nav :items="getMatrices" fixed-title="Matrices" />
    <page-title>{{ title }}</page-title>

    <p>
      The {{ matrixId }} Matrix ({{ getMatricesName }}) below shows the progression of tactics used in attacks as columns from left to right,
      with ML techniques belonging to each tactic below. Click on links to learn more about each item, or view
      {{ matrixId }} tactics and techniques using the links at the top navigation bar.
    </p>

    <v-row class="mt-10">
      <matrix-attack-style :tactics="populatedTactics" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name }, $route: { params } }) => ({
    matrixId: params.id,
    title: `${params.id} Matrix`,
    mitreTitle: name.mitre
  }),
  computed: {
    ...mapGetters('matrix', ['getMatrix']),
    getMatrices () {
      return this.$store.state.data.matrices
    },
    getMatricesName () {
      const matrix = this.$store.state.data.matrices.find(({ id }) => id === this.matrixId)
      return matrix.name ?? 'None'
    },
    populatedTactics () {
      return this.$store.state.data.objects.tactics[this.matrixId]
    }
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
