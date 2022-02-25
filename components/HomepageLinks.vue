<template>
  <!--Horizonal list, chip items-->
  <v-row justify="center">
    <v-card rounded="lg" outlined class="mb-10 mt-3 link-box">
      <v-list class="link-box">
        <v-list-item-group class="pa-3">
          <v-chip outlined nuxt="true" class="ma-1" to="/page/adversarial-ml-101">
            Adversarial ML 101
          </v-chip>
          <v-chip outlined nuxt="true" class="ma-1" to="/resources/contribute">
            Contribute
          </v-chip>
          <v-chip outlined nuxt="true" class="ma-1" to="/resources/feedback">
            Contact Us
          </v-chip>
          <v-chip outlined class="ma-1" :href="`${$config.navigator_url}`">
            <span>View on ATT&CK Navigator</span>
          </v-chip>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: 'HomepageLinks'
}
</script>
