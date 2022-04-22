<template>
  <v-toolbar
    flat
    elevation="1"
    dense
  >
    <v-toolbar-title class="text-caption font-weight-bold">
      {{ tactic.name }} {{ tactic.id }}
    </v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: 'MatrixTacticToolbar',
  props: ['tactic']
}
</script>
