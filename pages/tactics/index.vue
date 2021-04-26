<template>
<div>
  <breadcrumbs></breadcrumbs>
  <div class="text-h2">{{title}}</div>
  <info-table :items="getTactics" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    title: 'Adversarial ML Tactics'
  }),
  computed: {
    ...mapGetters(['getTactics'])
  }
}
</script>
