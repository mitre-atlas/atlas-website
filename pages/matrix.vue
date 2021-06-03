<template>
  <div>
    <!-- <div class="text-h2">{{ title }}</div> -->
    <page-title>{{ title }}</page-title>

    <p class="mb-10">
    {{ $config.name.long }}, or {{ $config.name.short }}, emphasizes adversarial attacks and attacks against ML systems. {{ $config.name.short }} recognizes that ML is an embedded technology and
    retains the high-level Technique and Tactic categories found in the <a href="https://attack.mitre.org/matrices/enterprise/">ATT&CK Enterprise</a> matrix. The definitions
    have been amended to emphasize the ML security aspects of each Technique. This enables {{ $config.name.short }} to adequately describe attacks against ML systems.
    Additionally, relevant TTPs from the ATT&CK Enterprise have been included in this knowledge base.
    </p>

    <v-row>
      <matrix-attack-style :matrix="getMatrix" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: `${name.short} Matrix`,
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
.row {
  overflow: auto;
}
</style>
