<template>
  <div class="mx-8">
    <breadcrumbs />
    <page-title>{{ title }}</page-title>
    <p>
      Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action.
      Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation.
      <sup><a href="https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf">[1]</a></sup>
    </p>
    <p>
      {{ mitreTitle }} tactics represent new adversary goals particular to machine learning systems, as well as tactics adapted from the MITRE ATT&CK<sup>&reg;</sup> Enterprise Matrix.
      In those cases, ATT&CK tactic definitions are stretched to include ML concepts.
    </p>
    <div v-html="description" />
    <info-table :items="getFilteredTactics" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    mitreTitle: name.mitre,
    title: 'Tactics',
    description: `The table below lists tactics from ${name.short}.  Scroll through the table or use the filter to narrow down the information.`
  }),
  head () {
    return {
      title: `${this.title} List | ${this.mitreTitle}`
    }
  },
  computed: {
    ...mapGetters(['getFilteredTactics'])
  }
}
</script>
