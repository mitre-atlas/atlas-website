<template>
<div>
  <breadcrumbs></breadcrumbs>
  <page-title>{{ title }}</page-title>
  <p>
    Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action.
    Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation.
    <sup><a href="https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf">[1]</a></sup>

  </p>
  <p>
  In some cases, the MITRE ATT&CK<sup>&reg;</sup> tactic definitions are stretched to include machine learning (ML) concepts. For example, poisoning training data leads to a different sort of persistence on a system.
  </p>
  <p>
    We include MITRE ATLAS tactics that represent new adversary goals that are particular to systems that incorporate ML as well as tactics from the ATT&CK Enterprise Matrix. Here, the adversary's tactical objective may involve an enterprise system that has ML components or an ML system.
  </p>
  <div v-html="description" />
  <info-table :show-filter-button="true" :items="getFilteredTactics" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    mitreTitle: name.mitre,
    title: 'Tactics',
    description: `The table below lists tactics from ${name.short} and tactics from ATT<span class="red--text text--darken-3">&</span>CK Enterprise that contain ${name.short} techniques.  Scroll through the table or use the filter to narrow down the information.`
  }),
  computed: {
    ...mapGetters(['getFilteredTactics'])
  },
  head () {
    return {
      title: `${this.title} List | ${this.mitreTitle}`
    }
  }
}
</script>
