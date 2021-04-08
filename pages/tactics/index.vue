<template>
<div>
  <breadcrumbs></breadcrumbs>
  <div class="text-h2">{{title}}</div>
  <info-table :items="getTactics" />
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
    title: 'Adversarial ML Tactics'
  }),
  computed: {
    ...mapGetters(['getTactics'])
  }
}
</script>
