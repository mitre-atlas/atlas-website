<template>
  <v-app>
    <client-only>
      <Header />

      <v-main>
        <!-- <announcement-banner /> -->
        <v-container>
          <data-side-nav />
          <v-container>
            <breadcrumbs-bar />
            <Nuxt />
          </v-container>
        </v-container>
      </v-main>

      <Footer />
    </client-only>
  </v-app>
</template>

<script>
export default {}
</script>
