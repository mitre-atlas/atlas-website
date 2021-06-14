<template>
<div>
  <breadcrumbs></breadcrumbs>
  <page-title>{{ title }}</page-title>
  <p>
    Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action.
    Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation.
    Tactics are treated as “tags” where a technique is associated with one or more tactic categories depending on the different results that can be achieved by using a technique.
  </p>
  <p>
  In some cases, the ATT&CK tactic definitions are stretched to include machine learning (ML) concepts. For example, poisoning training data leads to a different sort of persistence on a system.
  </p>
  <p>
    We list ATLAS tactics that represent new adversary goals that are particular to systems that incorporate ML as well as tactics from the ATT&CK Enterprise Matrix. Here, the adversary's tactical objective may involve an enterprise system that has ML components or an ML system.
  </p>
  <div v-html="description" />
  <info-table :items="getTactics" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: 'Tactics',
    description: 'The table below lists tactics from MITRE ' + name.short + ' and ATT<span class="red--text text--darken-3">&</span>CK<sup>&reg;</sup> Enterprise.  Scroll through the table or use the filters to narrow down the information.'
  }),
  computed: {
    ...mapGetters(['getTactics'])
  }
}
</script>
