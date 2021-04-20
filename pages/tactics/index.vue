<template>
<div class="content-container">
  <div class="side-menu-container">
    <side-menu contentType="tactics"></side-menu>
  </div>
  <div class="info-container">
    <breadcrumbs></breadcrumbs>
    <div class="text-h2">{{title}}</div>
    <info-table :items="getTactics" />
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumbs from '@/components/Breadcrumbs'
import SideMenu from '@/components/SideMenu'

export default {
  components: {
    Breadcrumbs,
    SideMenu
  },
  data: () => ({
    title: 'Adversarial ML Tactics'
  }),
  computed: {
    ...mapGetters(['getTactics'])
  }
}
</script>
