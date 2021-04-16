<template>
<div class="content-container">
  <div class="side-menu-container">
    <side-menu contentType="techniques"></side-menu>
  </div>
  <div class="info-container">
    <breadcrumbs></breadcrumbs>
    <div class="text-h2">{{title}}</div>
    <div class="text-body-1">{{description}}</div>
    <info-table :items="getTechniques" />
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
    title: 'Adversarial ML Techniques',
    description: 'Lists all techniques.'
  }),
  computed: {
    ...mapGetters(['getTechniques'])
  }
}
</script>
