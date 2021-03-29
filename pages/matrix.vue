<template>
  <div>
    <div class="text-h2">{{ title }}</div>
    <p>{{ description }}</p>

    <v-switch
      v-model="useAttackStyle"
      label="View in ATT&CK style"
      />

    <v-row v-if="!useAttackStyle">
      <v-col v-for="(tactic, i) in getMatrix.tactics" :key="i" cols="3">
        <matrix-tactic-toolbar :tactic="tactic" />
        <matrix-technique-list :techniques="tactic.techniques" />
      </v-col>
    </v-row>

    <v-row v-else>
      <matrix-attack-style :matrix="getMatrix" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    title: 'Adversarial ML Matrix',
    description:
      'Below are the tactics and techniques representing the adversarial machine learning threat matrix.',
    useAttackStyle: false
  }),
  computed: {
    ...mapGetters(['getMatrix', 'getTacticStyling'])
  }
}
</script>

<style scoped>
.v-col {
  overflow: scroll;
}
</style>
