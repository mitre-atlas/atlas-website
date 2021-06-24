<template>
  <v-timeline v-if="procedure.length" align-top dense>
    <v-timeline-item v-for="(p, i) in procedure" :key="i" small>
      <procedure-card :info="p" />
    </v-timeline-item>
    </v-timeline>
</template>

<script>
export default {
  name: 'EditProcedure',
  props: ['procedure']
}
</script>
