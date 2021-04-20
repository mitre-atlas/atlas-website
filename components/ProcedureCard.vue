<template>
  <v-card>
    <v-card-title>
      {{ techniqueName }}
    </v-card-title>
    <v-card-subtitle>
      {{ tacticName }}
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
    ]),
    tacticName () {
      const tactic = this.$store.getters.getTacticWhereIdIn(this.info.tactic)
      console.log('tactic: ' + tactic)
      console.log(this.info.tactic)

      if (tactic === undefined) {
        return 'TBD Tactic'
      }
      return tactic.name
    },
    techniqueName () {
      const technique = this.$store.getters.getTechniqueWhereIdIn(this.info.technique)
      console.log('technique: ' + technique)
      console.log(this.info.technique)

      if (technique === undefined) {
        return 'TBD Technique'
      }
      return technique.name
    }
  }
}
</script>
