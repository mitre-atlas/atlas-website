<template>
<div>
  <breadcrumbs></breadcrumbs>
  <page-title>{{ title }}</page-title>
  <div class="text-body-1">{{ description }}</div>
  <info-table :items="getTactics" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: 'Tactics',
    description: 'Lists tactics from ' + name + ' and ATT&CK Enterprise.'
  }),
  computed: {
    ...mapGetters(['getTactics'])
  }
}
</script>
