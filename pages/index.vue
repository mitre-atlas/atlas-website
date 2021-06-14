<template>
  <div>
    <v-alert
      color="blue"
      dismissible
      text
      type="info"
    >
      MITRE & Microsoft are hosting the 6th Annual Security Data Science Colloquium on Adversarial Machine Learning on June 29th.
      Learn more under <nuxt-link to='/resources/info'>annoucements</nuxt-link>!
    </v-alert>

    <!-- <div class="text-h2 my-5 text-center">{{ $config.name.short }}</div>
    <div class="text-h4 mb-5 text-center">{{ $config.name.long }}</div> -->
    <page-title>{{ $config.name.short }}</page-title>

    <v-row>
      <v-col cols="12">
        <div class="mb-10">
        <!-- <p>
        MITRE {{ $config.name.short }} is a knowledge base of adversarial tactics and techniques for machine learning (ML) security based on the
        <a href="https://attack.mitre.org" style="text-decoration: none;">MITRE ATT&CK<sup>&reg;</sup> framework</a>.
        Along with case studies demonstrating attacks on ML systems, this knowledge base enables machine learning and security communities to better understand ML threats.
        </p> -->
        <p>
        MITRE ATLAS is a knowledge base of adversary tactics, techniques, and case studies for machine learning (ML) systems based on real-world observations, demonstrations from ML red teams and security groups, and the state of the possible from academic research. ATLAS is modeled after the <a href="https://attack.mitre.org" style="text-decoration: none;">MITRE ATT&CK<sup>&reg;</sup> framework</a> framework and its tactics and techniques are complementary to those in ATT&CK.
        </p>
        <p>
        ATLAS enables researchers to navigate the landscape of threats to machine learning systems. ML is increasingly used across a variety of industries. There are a growing number of vulnerabilities in ML, and its use increases the attack surface of existing systems. We developed ATLAS to raise awareness of these threats and present them in a way familiar to security researchers.
        </p>

        <p>Placeholder to briefly introduce the matrix below.</p>
        </div>
      </v-col>

      <!-- <v-col>
        <div class="text-center mb-10">
        <NuxtLink to="/page/adversarial-ml-101" style="text-decoration: none;">Adversarial ML 101</NuxtLink>
          <br>
          <NuxtLink to="/resources/contribute" style="text-decoration: none;">Contribute</NuxtLink>
          <br>
          <NuxtLink to="/resources/feedback" style="text-decoration: none;">Contact Us</NuxtLink>
          <br>
          <span><a :href="`${$config.navigator_url}`" target="_blank" style="text-decoration: none;">View on ATT&CK Navigator</a><v-icon small>mdi-open-in-new</v-icon></span>
        </div>
      </v-col> -->
    </v-row>

    <v-row>
      <matrix-attack-style :matrix="this.$store.getters.getMatrix" />
    </v-row>
  </div>
</template>

<script>
export default {
  data: ({ $config: { name } }) => ({
    title: `${name.long}`
  })
}
</script>

<style scoped>
.row {
  overflow: auto;
}
</style>
