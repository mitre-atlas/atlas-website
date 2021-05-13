<template>
  <div>
    <page-title>{{ title }}</page-title>

    <v-row>
      <v-col cols="8">
        <p class="mb-10">
        The {{ $config.name.short }} Threat Matrix is a knowledge base of adversarial tactics and techniques for machine learning (ML) security based on <a href="https://attack.mitre.org" style="text-decoration: none;">the ATT&CK framework</a>.
        Along with case studies demonstrating attacks on ML systems, this knowledge base enables machine learning and security communities to better understand ML threats.
        </p>
      </v-col>

      <v-col>
        <div class="text-center mb-10">
        <NuxtLink to="/page/adversarial-ml-101" style="text-decoration: none;">Adversarial ML 101</NuxtLink>
          <br>
          <NuxtLink to="/resources/contribute" style="text-decoration: none;">Contribute</NuxtLink>
          <br>
          <NuxtLink to="/resources/feedback" style="text-decoration: none;">Contact Us</NuxtLink>
          <br>
          <span><a :href="`${$config.navigator_url}`" target="_blank" style="text-decoration: none;">View on ATT&CK Navigator</a><v-icon small>mdi-open-in-new</v-icon></span>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <matrix-attack-style :matrix="this.$store.getters.getMatrix" />
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: 'Adversarial Machine Learning Threat Matrix'
  })
}
</script>

<style scoped>
.row {
  overflow: auto;
}
</style>
