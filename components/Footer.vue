<template>
  <v-footer padless dark>
    <v-card flat tile width="100%" color="grey darken-3"><!-- MTIRE Navy #0D2F4F -->
      <v-card-text class="text-center">
        MITRE ATLAS<sup>&trade;</sup> and MITRE ATT&CK<sup>&reg;</sup> are registered trademarks of The MITRE Corporation.
      </v-card-text>
      <v-card-actions class="justify-center">
        <span>
          <v-btn text nuxt to="/resources/privacy-policy">Privacy Policy</v-btn>
          &nbsp; &nbsp;
          <v-btn text nuxt to="/resources/terms">Terms of Use</v-btn>
        </span>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>
<script>
export default {
  name: 'Footer'
}
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>
