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
  data: () => ({
    title: 'Adversarial ML Techniques',
    description: 'Lists all techniques.'
  }),
  computed: {
    ...mapGetters(['getTechniques'])
  }
}
</script>
