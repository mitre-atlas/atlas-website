<template>
  <div :class="computedClass">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <nuxt-link
          :to="`/techniques/${technique.id}`"
          v-bind="attrs"
          v-on="on"
          >
          {{ technique.name }}
        </nuxt-link>
      </template>
      <span>{{ technique.id }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'AttackTechniqueCell',
  props: [
    'technique',
    'isSupertechnique'
  ],
  computed: {
    computedClass () {
      let className = 'technique-cell'
      if (this.isSupertechnique) {
        className += ' supertechniquecell'
      }
      return className
    }
  }
}
</script>

<style scoped src="~/assets/matrix.css">
</style>
