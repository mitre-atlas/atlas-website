<template>
<div>
  <breadcrumbs></breadcrumbs>
  <page-title>{{ title }}</page-title>
  <div v-html="description" />
  <info-table :items="getTactics" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: 'Tactics',
    description: 'Lists tactics from ' + name.short + ' and ATT<span class="red--text text--darken-3">&</span>CK Enterprise.'
  }),
  computed: {
    ...mapGetters(['getTactics'])
  }
}
</script>
