<template>
  <v-tooltip right>
    <template #activator="{ on, attrs }">
      <v-icon
        color="secondary"
        text
        v-bind="attrs"
        left
        small
        v-on="on"
      >
        mdi-information-outline
      </v-icon>
    </template>
    <span>
      <v-card-title>Procedure Steps Legend</v-card-title>
      <v-card-text>
        <li style="list-style: none; margin-bottom: 2%"> <v-icon color="white">mdi-arrow-up-down</v-icon> Hold and drag to move procedure cards.</li>
        <li style="list-style: none; margin-bottom: 2%"> <v-icon color="blue">mdi-pencil</v-icon> Click to edit procedure card.</li>
        <li style="list-style: none; margin-bottom: 2%"> <v-icon color="red">mdi-delete</v-icon> Click to delete procedure card.</li>
      </v-card-text>
    </span>
  </v-tooltip>
</template>
<script>
export default {
  name: 'ProcedureLegend',
  props: [
    'doShow'
  ],
  data () {
    return {
      show: this.doShow
    }
  }
}
</script>
