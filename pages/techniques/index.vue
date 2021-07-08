<template>
<div>
  <breadcrumbs></breadcrumbs>
  <page-title>{{ title }}</page-title>
  <p>
  Techniques describe the means by which adversaries achieve tactical goals. They represent “how” an adversary achieves a tactical objective by performing an action.
  For example, an adversary may gain initial access by compromising the machine learning (ML) supply chain.
  Techniques may also represent “what” an adversary gains by performing an action. This is a useful distinction for the ML Attack Staging tactic,
  where the adversary is typically creating or modifying an ML artifact that will be used in a subsequent tactical objective. There may be many ways, or techniques,
  to achieve tactical objectives, so there are multiple techniques in each tactic category.
  <sup><a href="https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf">[1]</a></sup>
  </p>
  <!--
  <p>
    We include MITRE ATLAS techniques alongside MITRE ATT&CK<sup>&reg;</sup> techniques because an adversary may use an ATLAS or ATT&CK technique to achieve a particular objective and may use both ATLAS and ATT&CK techniques during an operation. For example, and adversary may exfiltrate  ML artifacts via traditional means (e.g. via physical medium or transfer to cloud account) or via techniques enabled by the presence of ML subsystems such as an inference API.
  </p>
  -->
  <div v-html="description" />
  <info-table :items="getFilteredTechniques" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    mitreTitle: name.mitre,
    title: 'Techniques',
    description: 'The table below lists techniques from MITRE ' + name.short + '. Scroll through the table or use the filter to narrow down the information.'
  }),
  computed: {
    ...mapGetters(['getFilteredTechniques'])
  },
  head () {
    return {
      title: `${this.title} List | ${this.mitreTitle}`
    }
  }
}
</script>
