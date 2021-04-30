<template>
  <v-app>
    <client-only>

      <Header />

      <side-menu
        v-if="doShow">
      </side-menu>

      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
      </client-only>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      pathsWithNav: [
        '/tactics',
        '/techniques',
        '/studies'
        // 'studies-id'
      ]
    }
  },
  computed: {
    doShow () {
      // Returns true if this route should show the navigation drawer
      return this.pathsWithNav.some((path) => {
        return this.$route.path.startsWith(path)
      })
      // return this.pathsWithNav.includes(this.$route.name)
    }
  }
}
</script>
