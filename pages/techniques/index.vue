<template>
  <div>
    <breadcrumbs />
    <page-title>{{ title }}</page-title>
    <p>
      Techniques describe the means by which adversaries achieve tactical goals. They represent “how” an adversary achieves a tactical objective by performing an action.
      For example, an adversary may gain initial access by compromising the machine learning (ML) supply chain.
    </p>
    <p>
      Techniques may also represent “what” an adversary gains by performing an action. This is a useful distinction for the ML Attack Staging tactic,
      where the adversary is typically creating or modifying an ML artifact that will be used in a subsequent tactical objective.
      There can be multiple techniques in each tactic category as there are many ways to achieve tactical objectives.
      <sup><a href="https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf">[1]</a></sup>
    </p>
    <div v-html="description" />
    <info-table :items="getFilteredTechniques" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: 'Techniques',
    description: `The table below lists techniques from ${name.mitre}. Scroll through the table or use the filter to narrow down the information.`
  }),
  head () {
    return {
      title: `${this.title} List | ${this.$config.name.mitre}`
    }
  },
  computed: {
    ...mapGetters(['getFilteredTechniques'])
  }
}
</script>
