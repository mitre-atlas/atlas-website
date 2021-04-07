<template>
<div>
  <breadcrumbs></breadcrumbs>
  <div class="text-h2">{{title}}</div>
  <div class="text-body-1">{{description}}</div>
  <info-table :items="getTechniques" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  components: {
    Breadcrumbs
  },
  data: () => ({
    title: 'Adversarial ML Techniques',
    description: 'Lists all techniques.'
  }),
  computed: {
    ...mapGetters(['getTechniques'])
  }
}
</script>
