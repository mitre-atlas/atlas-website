<template>
<div>
  <breadcrumbs></breadcrumbs>
  <page-title>{{ title }}</page-title>
  <div class="text-body-1">{{description}}</div>
  <info-table :items="getTechniques" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: 'Techniques',
    description: 'Lists techniques from ' + name + ' and ATT&CK Enterprise.'
  }),
  computed: {
    ...mapGetters(['getTechniques'])
  }
}
</script>
