<template>
  <div class="breadcrumbs">
    <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [],
      idGetter: null
    }
  },
  methods: {
    capitalizeFirstLetter (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    setStoreGetter (indexRoute) {
      if (indexRoute === 'techniques') {
        this.idGetter = this.$store.getters.getTechniqueById
      } else if (indexRoute === 'tactics') {
        this.idGetter = this.$store.getters.getTacticById
      } else {
        this.idGetter = this.$store.getters.getStudyById
      }
    }
  },
  mounted () {
    const pathItems = this.$route.path.split('/').slice(1)
    const homeItem = { to: '/', text: 'Home', exact: true }
    let indexItem = null
    if (pathItems.length === 1) {
      indexItem = { to: '/' + pathItems[0], text: this.capitalizeFirstLetter(pathItems[0]), exact: true, disabled: true }
    } else {
      indexItem = { to: '/' + pathItems[0], text: this.capitalizeFirstLetter(pathItems[0]), exact: true }
    }
    this.items.push(homeItem)
    this.items.push(indexItem)
    if (pathItems.length > 1) {
      this.setStoreGetter(pathItems[0])
      const pathItemText = this.idGetter(pathItems[1])
      const idItem = { to: '/' + pathItems[0] + '/' + pathItems[1], text: pathItemText.name, exact: true, disabled: true }
      this.items.push(idItem)
    }
  }
}
</script>

<style>

</style>
