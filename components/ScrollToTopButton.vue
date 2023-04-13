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
/**
 * Floating action button that on click scrolls to the top of the page.
 */
export default {
  name: 'ScrollToTopButton',
  data: () => ({
    /**
     * Determines if the button will show to user based on how far they have scrolled.
     * @type {Boolean}
     */
    fab: false
  }),
  methods: {
    /**
     * When the user scrolls, if they scroll down past a certain distance, fab
     * will be set to true and the button will be displayed.
     */
    onScroll (e) {
      if (typeof window === 'undefined') {
        return
      }
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 50
    },
    /**
     * When the user clicks the button, it will scroll to the top of the page.
     */
    toTop () {
      this.$vuetify.goTo(0)
    }
  }
}
</script>
