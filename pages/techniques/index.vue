<template>
<div>
  <breadcrumbs></breadcrumbs>
  <page-title>{{ title }}</page-title>
  <div v-html="description" />
  <info-table :items="getTechniques" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: 'Techniques',
    description: 'Lists techniques from ' + name + ' and ATT<span class="red--text text--darken-3">&</span>CK Enterprise.'
  }),
  computed: {
    ...mapGetters(['getTechniques'])
  }
}
</script>
