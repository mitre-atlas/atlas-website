<template>
  <div class="breadcrumbs">
    <v-breadcrumbs :items="items" divider=">" />
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
  mounted () {
    const pathItems = this.$route.path.split('/').slice(1).filter(e => !!e)
    // console.log(pathItems)
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
  }
}
</script>

<style>

</style>
