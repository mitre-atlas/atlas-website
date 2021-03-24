<template>
  <v-card>
    <v-card-title>
      {{ getTechniqueWhereIdIn(info.technique).name }}
    </v-card-title>
    <v-card-subtitle>
      {{ getTacticWhereIdIn(info.tactic).name }}
    </v-card-subtitle>
    <v-card-text>
      {{ info.description }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProcedureCard',
  props: ['info'],
  computed: {
    ...mapGetters([
      'getTacticWhereIdIn',
      'getTechniqueWhereIdIn'
    ])
  }
}
</script>
