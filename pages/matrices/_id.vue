<template>
  <div>
    <page-title>{{ title }}</page-title>

    <p class="tw-prose tw-max-w-none">
      The {{ matrixId }} Matrix below shows the general progression of attack tactics as column headers from left to right, with attack techniques organized below each tactic. <span class="attack-and">&</span>&nbsp;indicates a tactic or technique directly adapted from from ATT&CK. Click on the blue links to learn more about each item, or search and view more details about {{ shortName }}  tactics and techniques using the links in the top navigation bar.
    </p>
    <v-row class="mt-10">
      <matrix-attack-style :tactics="populatedTactics" />
    </v-row>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
/**
 * @name matrices/_id
 *
 * Matrices template
 */
export default {
  layout: 'side-nav',
  validate ({ params, store }) {
    // Ensure that ID is valid
    return store.getters.getMatrixIds.includes(params.id)
  },
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
      // If there's no matrix id, return none
      if (!this.matrixId) {
        return 'None'
      }
      // Match matrices id with matrixId from data() and return matching matrix name
      const matrix = this.$store.state.data.matrices.find(
        ({ id }) => id === this.matrixId
      )
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
