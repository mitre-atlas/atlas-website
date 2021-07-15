<template>
  <div>
    <!--
    <v-alert
      color="blue"
      dismissible
      text
      type="info"
    >

    </v-alert>
    -->

    <!-- <div class="text-h2 my-5 text-center">{{ $config.name.short }}</div>
    <div class="text-h4 mb-5 text-center">{{ $config.name.long }}</div> -->
    <!-- <page-title>{{ $config.name.short }}</page-title> -->

    <v-row>
      <v-col cols="12">
        <div class="my-10">
        <!-- <p>
        MITRE {{ $config.name.short }} is a knowledge base of adversarial tactics and techniques for machine learning (ML) security based on the
        <a href="https://attack.mitre.org" style="text-decoration: none;">MITRE ATT&CK<sup>&reg;</sup> framework</a>.
        Along with case studies demonstrating attacks on ML systems, this knowledge base enables machine learning and security communities to better understand ML threats.
        </p> -->
        <p>
        MITRE {{ $config.name.short }}, {{ $config.name.long }}, is a knowledge base of adversary tactics, techniques, and case studies for machine learning (ML) systems based on real-world observations, demonstrations from ML red teams and security groups, and the state of the possible from academic research. ATLAS is modeled after the <a href="https://attack.mitre.org" >MITRE ATT&CK<sup>&reg;</sup> framework</a> and its tactics and techniques are complementary to those in ATT&CK.
        </p>

        <p>
        ATLAS enables researchers to navigate the landscape of <NuxtLink to="resources/adversarial-ml-101">threats to machine learning systems</NuxtLink>. ML is increasingly used across a variety of industries. There are a growing number of vulnerabilities in ML, and its use increases the attack surface of existing systems. We developed ATLAS to raise awareness of these threats and present them in a way familiar to security researchers.
        </p>
        <!-- <homepage-links /> -->
         <!-- <page-title class="mt-10 text-center">{{ $config.name.short }}</page-title> -->
        <img src="~/assets/ATLAS_black.svg" height="60" class="d-block mx-auto" />
      </div>
      <div>
        <p>
          The ATLAS Matrix below shows the progression of tactics used in attacks as columns from left to right,
          with ML techniques belonging to each tactic below. Click on links to learn more about each item, or view
           ATLAS tactics and techniques using the links at the top navigation bar.
        </p>

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
/* .attack-style {
  color: #c63f1f;
  white-space: pre;
}

span.link-box {
  background-color: transparent;
}

.link-box {
  background-color: black;
} */
</style>
