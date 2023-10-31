<template>
  <v-app>
    <client-only>
      <Header />

      <v-main>
        <!-- <announcement-banner /> -->
        <v-container>
          <breadcrumbs />
          <Nuxt />
        </v-container>
      </v-main>

      <Footer />
    </client-only>
  </v-app>
</template>
