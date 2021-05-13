<template>
  <v-card>
    <v-card-title>
      <!-- {{ getTechniqueById(info.technique).name }} -->
      <nuxt-link
        :to="`/techniques/${techniqueId}`"
        style="text-decoration: none; color: inherit;"
        >
          {{ techniqueName }}
      </nuxt-link>
    </v-card-title>
    <v-card-subtitle>
      <!-- {{ getTacticById(info.tactic).name }} -->
      <nuxt-link
        :to="`/tactics/${tacticId}`"
        style="text-decoration: none; color: inherit;"
        >
          {{ tacticName }}
      </nuxt-link>
    </v-card-subtitle>
    <v-card-text v-html="info.description" />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProcedureCard',
  props: ['info'],
  computed: {
    ...mapGetters([
      'getTacticById',
      'getTechniqueById'
    ]),
    tacticName () {
      const tactic = this.$store.getters.getTacticById(this.info.tactic)

      if (tactic === undefined) {
        return '(Name not found for technique ' + this.info.tactic + ')'
      }
      return tactic.name
    },
    techniqueName () {
      const technique = this.$store.getters.getTechniqueById(this.info.technique)

      if (technique === undefined) {
        return '(Name not found for technique ' + this.info.technique + ')'
      }
      return technique.name
    },
    tacticId () {
      const tactic = this.$store.getters.getTacticById(this.info.tactic)

      if (tactic === undefined) {
        // Dummy placeholder
        return 'tactic_not_found'
      }
      return tactic.id
    },
    techniqueId () {
      const technique = this.$store.getters.getTechniqueById(this.info.technique)

      if (technique === undefined) {
        // Dummy placeholder
        return 'technique_not_found'
      }
      return technique.id
    }
    // technique () {
    //   return this.getTechniqueById(this.info.technique)
    // },
    // tactic () {
    //   return this.getTacticById(this.info.tactic)
    // }
  }
}
</script>
