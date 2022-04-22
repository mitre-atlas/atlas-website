<template>
  <v-app>
    <client-only>

      <Header />

      <v-main>
        <v-container>
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
