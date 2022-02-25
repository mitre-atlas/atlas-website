<template>
  <v-fab-transition>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon dark>
        mdi-chevron-up
      </v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'ScrollToTopButton',
  data: () => ({
    fab: false
  }),
  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') {
        return
      }
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 50
    },
    toTop () {
      this.$vuetify.goTo(0)
    }
  }
}
</script>
