<template>
  <v-card>
    <v-card-title>
      <nuxt-link :to="technique.route">
        {{ techniqueLabel }}
      </nuxt-link>
    </v-card-title>
    <v-card-subtitle>
      <nuxt-link :to="tactic.route">
        {{ tacticName }}
      </nuxt-link>
    </v-card-subtitle>
    <v-card-text
      style="color: black"
      class="tw-prose tw-max-w-none"
      v-html="$md.render(info.description)"
    />
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
/**
 * A card containing the information of a case study's procedure step.
 * @see {ProcedureTimeline.vue} Wrapper for the procedure cards
 */
export default {
  name: 'ProcedureCard',
  props: [
    /**
     * Contains one procedure steps tactic, technique, and description to render.
     * @type {Object}
     */
    'info'
  ],
  computed: {
    ...mapGetters(['getDataObjectById']),
    /**
     * Using the id, get all of tactic's info
     * @returns {Object}
     */
    tactic () {
      return this.getDataObjectById(this.info.tactic)
    },
    /**
     * Using the id, get all of technique's info
     * @returns {Object}
     */
    technique () {
      return this.getDataObjectById(this.info.technique)
    },
    /**
     * Get tactic's name
     * @returns {String}
     */
    tacticName () {
      if (this.tactic === undefined) {
        return '(Name not found for technique ' + this.info.tactic + ')'
      }
      return this.tactic.name
    },
    /**
     * Get technique's label, in which label is either name or parent:subtechnique name
     * @returns {String}
     */
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
.v-card__title :hover,
.v-card__subtitle :hover {
  text-decoration: underline;
}

a {
  color: inherit !important;
}

/* Add bottom margin to bullet points in descriptions */
.v-timeline-item__body .v-card__text >>> ul {
  margin-bottom: 16px;
}
</style>
