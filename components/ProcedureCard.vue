<template>
  <v-card>
    <v-card-title>
      <nuxt-link
        :to="technique.route"
      >
        {{ techniqueLabel }}
      </nuxt-link>
    </v-card-title>
    <v-card-subtitle>
      <nuxt-link
        :to="tactic.route"
      >
        {{ tacticName }}
      </nuxt-link>
    </v-card-subtitle>
    <v-card-text style="color: black" v-html="$md.render(info.description)" />
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProcedureCard',
  props: ['info'],
  computed: {
    ...mapGetters(['getDataObjectById']),
    tactic () {
      return this.getDataObjectById(this.info.tactic)
    },
    technique () {
      return this.getDataObjectById(this.info.technique)
    },
    tacticId () {
      if (this.tactic === undefined) {
        // Dummy placeholder
        return 'tactic_not_found'
      }
      return this.tactic.id
    },
    techniqueId () {
      if (this.technique === undefined) {
        // Dummy placeholder
        return 'technique_not_found'
      }
      return this.technique.id
    },
    tacticName () {
      if (this.tactic === undefined) {
        return '(Name not found for technique ' + this.info.tactic + ')'
      }
      return this.tactic.name
    },
    techniqueLabel () {
      if (this.technique === undefined) {
        return '(Name not found for technique ' + this.info.technique + ')'
      }
      return this.technique.label
    }
  }
}
</script>
<style scoped>

  /* Inbuilt nuxt title classes styled to highlight titles as links  */
  .v-card__title :hover, .v-card__subtitle :hover {
    text-decoration: underline;
  }

  a {
    color: inherit !important;
  }

</style>
