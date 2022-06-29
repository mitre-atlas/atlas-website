<template>
  <v-app>
    <client-only>
      <Header />

      <v-main>
        <v-container>
          <breadcrumbs />
          <Nuxt />
        </v-container>
      </v-main>

      <Footer />
    </client-only>
  </v-app>
</template>

<script>
export default {

}
</script>
