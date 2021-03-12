<template>
  <img :src="dynamicImage">
</template>

<script>
export default {
  name: 'MarkdownImage',
  props: {
    imagename: String
  },
  computed: {
    dynamicImage () {
      return require(`~/assets/${this.imagename}`)
    }
  }
}
</script>

<style>

</style>
