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
/**
 * A timeline of procedure steps that describe a case study.
 */
export default {
  name: 'ProcedureTimeline',
  props: ['study']
}
</script>
