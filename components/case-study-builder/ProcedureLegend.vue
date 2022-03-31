<template>
  <v-tooltip
    top
    color="grey lighten-4"
  >
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
      <v-card-title style="color:#424242">Procedure Steps Legend</v-card-title>
      <v-card-text style="color:#424242">
        <li style="list-style: none; margin-bottom: 2%"> <v-icon>mdi-arrow-up-down</v-icon> Hold and drag to move procedure cards.</li>
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
