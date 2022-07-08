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
export default {
  beforeCreate () {
    if (!this.$route.params.id) {
      // find first valid id & go to valid id page
      const matrices = this.$store.state.data.matrices

      if (matrices.length > 0 && !!matrices[0].id) {
        this.$router.push({ path: this.$route.path + matrices[0].id })
      }
    }
  },
  data: ({ $config: { name }, $route: { params } }) => ({
    matrixId: params.id,
    title: `${params.id} Matrix`,
    mitreTitle: name.mitre
  }),
  computed: {
    getMatrices () {
      return this.$store.state.data.matrices
    },
    getMatricesName () {
      if (!this.matrixId) {
        return 'None'
      }
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
