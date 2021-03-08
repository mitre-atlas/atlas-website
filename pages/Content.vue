<template>
  <div>
    <Header />
    <div class="content-wrapper" v-if="page != null">
      <nuxt-content :document="page" />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  data () {
    return {
      page: null
    }
  },
  components: {
    Header
  },
  methods: {
    setupContent () {
      console.log(this.$route.query.page)
      this.$content(`pages/${this.$route.query.page}`).fetch().then((response) => {
        this.page = response
      })
    }
  },
  mounted () {
    this.setupContent()
  },
  watch: {
    '$route.query.page': {
      handler (page) {
        this.setupContent()
      }
    }
  }
}
</script>

<style>

.nuxt-content {
  margin: 3rem;
}

.nuxt-content h1 {
  text-align: center;
  font-weight: bold;
}

.nuxt-content h2 {

}

.nuxt-content a {
  color: gray;
}

</style>
