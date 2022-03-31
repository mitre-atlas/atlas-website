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
        <li v-for="object in object" :key="object.value" style="list-style: none; margin-bottom: 2%">
          <v-icon :color="object.color">{{object.icon}}</v-icon>
          {{object.value}}
        </li>
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
      show: this.doShow,
      object: [
        {
          icon: 'mdi-arrow-up-down',
          value: 'Hold and drag to move procedure cards.',
          color: 'grey'
        },
        {
          icon: 'mdi-pencil',
          value: 'Click to edit procedure card.',
          color: 'blue'
        },
        {
          icon: 'mdi-delete',
          value: 'Click to delete procedure card.',
          color: 'red'
        }
      ]
    }
  }
}
</script>
