<template>
  <v-toolbar
    flat
    elevation="1"
    dense
  >
    <v-toolbar-title>
      <v-icon
        left
        :color="tacticStyle.color"
      >
        {{ tacticStyle.icon }}
      </v-icon>
      {{ tactic.name }}
    </v-toolbar-title>

    <v-spacer />

    <v-badge
      :content="tactic.techniques.length"
      inline
      color="grey"
    />

  </v-toolbar>
</template>

<script>
export default {
  name: 'MatrixTacticToolbar',
  props: ['tactic'],
  computed: {
    tacticStyle () {
      return this.$store.getters.getTacticStyling[this.tactic.name]
    }
  }
}
</script>
