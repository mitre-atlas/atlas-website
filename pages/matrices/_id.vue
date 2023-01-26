<template>
  <div>
    <page-title>{{ title }}</page-title>

    <p>
      The {{ matrixId }} Matrix ({{ getMatricesName }}) below shows the progression of tactics used in attacks as columns from left to right,
      with ML techniques belonging to each tactic below.
      <span v-if="populatedTactics.some((o) => 'ATT&CK-reference' in o)"><span class="attack-and">&</span>&nbsp;indicates an adaptation from ATT&CK.</span>
      Click on links to learn more about each item, or view
      {{ matrixId }} tactics and techniques using the links at the top navigation bar.
    </p>
    <v-row class="mt-10">
      <matrix-attack-style :tactics="populatedTactics" />
    </v-row>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  layout: 'side-nav',
  data: ({ $config: { name }, $route: { params } }) => ({
    matrixId: params.id,
    title: `${params.id} Matrix`,
    mitreTitle: name.mitre
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  },
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
  mounted () {
    this.setNavItems({
      data: this.getMatrices,
      title: 'Matrices'
    })
  },
  methods: {
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
</style>
