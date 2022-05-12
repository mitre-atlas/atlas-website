<template>
  <v-card>
    <v-card-title>
      <nuxt-link
        v-if="parentTechnique !== undefined"
        :to="technique.route"
        style="color: inherit;"
      >
        {{ parentTechniqueName }}: {{ techniqueName }}
      </nuxt-link>
      <nuxt-link
        v-else
        :to="technique.route"
        style="color: inherit;"
      >
        {{ techniqueName }}
      </nuxt-link>
    </v-card-title>
    <v-card-subtitle>
      <nuxt-link
        :to="tactic.route"
        style="color: inherit;"
      >
        {{ tacticName }}
      </nuxt-link>
    </v-card-subtitle>
    <v-card-text v-html="$md.render(info.description)" />
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
    techniqueName () {
      if (this.technique === undefined) {
        return '(Name not found for technique ' + this.info.technique + ')'
      }
      return this.technique.name
    },
    parentTechnique () {
      const parentTechniqueId = this.technique['subtechnique-of']
      return this.getDataObjectById(parentTechniqueId)
    },
    parentTechniqueName () {
      if (this.parentTechnique === undefined) {
        return ''
      }
      return this.parentTechnique.name
    }
  }
}
</script>
