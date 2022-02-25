<template>
  <img :src="dynamicImage" alt="image not found" class="markdown-image">
</template>

<script>
export default {
  name: 'MarkdownImage',
  props: {
    imagename: {
      type: String,
      default: ''
    }
  },
  computed: {
    dynamicImage () {
      return require(`~/assets/${this.imagename}`)
    }
  }
}
</script>

<style>

.markdown-image {
  width: -moz-available;
}

</style>
