<template>
  <v-timeline
    align-top
    dense
    >
    <v-timeline-item
      v-for="(p, i) in study.procedure"
      :key="i"
      small

      >
      <procedure-card :info="p" />
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  name: 'ProcedureTimeline',
  props: ['study'],
  methods: {
    // lookupTacticStyling (procedureItem) {
    //   const tactic = this.$store.getters.getTacticWhereIdIn(procedureItem.tactic)
    //   return this.$store.getters.getTacticStyling[tactic.name]
    // }
  }
}
</script>
