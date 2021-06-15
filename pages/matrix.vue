<template>
  <div>
    <!-- <div class="text-h2">{{ title }}</div> -->
    <page-title>{{ title }}</page-title>

    <p>
    MITRE {{ $config.name.short }} emphasizes adversarial attacks and attacks against ML systems. {{ $config.name.short }} recognizes that ML is an embedded technology and
    retains the high-level technique and tactic categories found in the <a href="https://attack.mitre.org/matrices/enterprise/">MITRE ATT&CK<sup>&reg;</sup> Enterprise Matrix</a>. The definitions
    have been amended to emphasize the ML security aspects of each technique. This enables {{ $config.name.short }} to adequately describe attacks against ML systems.
    Additionally, relevant TTPs from the ATT&CK Enterprise have been included in this knowledge base.
    </p>

    <p>
      The ATLAS ML Matrix below shows the progression of tactics used in attacks as columns from left to right,
      with ML techniques belonging to each tactic below. Click on links to learn more about each item, or view
      the combined ATLAS and ATT&CK tactics and techniques using the links at the top navigation bar.
    </p>

    <v-row  class="mt-10">
      <matrix-attack-style :matrix="getMatrix" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: `${name.short} ML Matrix`
  }),
  computed: {
    ...mapGetters(['getMatrix'])
  }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
a {
  text-decoration: none;
}
</style>
