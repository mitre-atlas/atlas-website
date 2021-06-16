<template>
  <v-footer padless dark>
    <v-card flat tile width="100%" color="grey darken-3"><!-- MTIRE Navy #0D2F4F -->
    <v-row align="center">
      <v-col cols="2">
        <a href="https://www.mitre.org/">
          <img src="~/assets/mitre-logo-white.svg" height="45" class="d-block mx-auto" />
        </a>
      </v-col>
      <v-col cols="8">
      <v-card-text class="text-center">
        MITRE ATLAS and MITRE ATT&CK are registered trademarks of The MITRE Corporation.
      </v-card-text>
      <v-card-actions class="justify-center">
        <span>
          <v-btn text nuxt to="/resources/privacy-policy">Privacy Policy</v-btn>
          &nbsp; &nbsp;
          <v-btn text nuxt to="/resources/terms">Terms of Use</v-btn>
        </span>
      </v-card-actions>
      </v-col>
      <v-col cols="2" class="text-center">
        <v-btn nuxt to="/resources/feedback" color="#005B94">Contact</v-btn>
      </v-col>
    </v-row>
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
