<template>
  <div>
    <div class="content-wrapper" v-if="page != null">
      <nuxt-content :document="page" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: null
    }
  },
  methods: {
    setupPage () {
      this.$content(`${this.$route.params.id}`).fetch().then((response) => {
        this.page = response
      })
    }
  },
  mounted () {
    this.setupPage()
  }
}
</script>
