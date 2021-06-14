<template>
  <div>
    <!-- <div class="text-h2">{{ title }}</div> -->
    <page-title>{{ title }}</page-title>

    <p class="mb-10">
    MITRE {{ $config.name.short }} emphasizes adversarial attacks and attacks against ML systems. {{ $config.name.short }} recognizes that ML is an embedded technology and
    retains the high-level technique and tactic categories found in the <a href="https://attack.mitre.org/matrices/enterprise/">MITRE ATT&CK<sup>&reg;</sup> Enterprise Matrix</a>. The definitions
    have been amended to emphasize the ML security aspects of each technique. This enables {{ $config.name.short }} to adequately describe attacks against ML systems.
    Additionally, relevant TTPs from the ATT&CK Enterprise have been included in this knowledge base.
    </p>

    <v-row>
      <v-col>
        <p>Placeholder to briefly introduce the matrix.</p>
      </v-col>
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
