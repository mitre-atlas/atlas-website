<template>
  <v-footer>
    <v-card flat tile width="100%">
      <v-card-text class="text-center">
        MITRE ATLAS<sup>&trade;</sup> and MITRE ATT&CK<sup>&reg;</sup> are registered trademarks of The MITRE Corporation.
      </v-card-text>
      <v-card-actions class="justify-center">
        <span>
        <a href="#">Privacy Policy</a>
        &nbsp; &nbsp;
        <a href="#">Terms of Use</a>
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
