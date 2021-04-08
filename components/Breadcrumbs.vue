<template>
  <div class="breadcrumbs">
    <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: []
    }
  },
  methods: {
    capitalizeFirstLetter (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  mounted () {
    const pathItems = this.$route.path.split('/').slice(1)
    const homeItem = { href: '/', text: 'Home', exact: true }
    const indexItem = { href: '/' + pathItems[0], text: this.capitalizeFirstLetter(pathItems[0]), exact: true }
    this.items.push(homeItem)
    this.items.push(indexItem)
    if (pathItems.length > 1) {
      const idItem = { href: '/' + pathItems[0] + '/' + pathItems[1], text: this.capitalizeFirstLetter(pathItems[1]), exact: true }
      this.items.push(idItem)
    }
  }
}
</script>

<style>

</style>
