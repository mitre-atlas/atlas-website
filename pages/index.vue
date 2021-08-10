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
        {{ mitreTitle }}, {{ longName }}, is a knowledge base of adversary tactics, techniques, and case studies for machine learning (ML) systems based on real-world observations, demonstrations from ML red teams and security groups, and the state of the possible from academic research. {{ shortName }} is modeled after the <a href="https://attack.mitre.org" >MITRE ATT&CK<sup>&reg;</sup> framework</a> and its tactics and techniques are complementary to those in ATT&CK.
        </p>

        <p>
        {{ shortName }} enables researchers to navigate the landscape of <NuxtLink to="resources/adversarial-ml-101">threats to machine learning systems</NuxtLink>. ML is increasingly used across a variety of industries. There are a growing number of vulnerabilities in ML, and its use increases the attack surface of existing systems. We developed {{ shortName }} to raise awareness of these threats and present them in a way familiar to security researchers.
        </p>
        <!-- <homepage-links /> -->
         <!-- <page-title class="mt-10 text-center">{{ $config.name.short }}</page-title> -->
        <img src="~/assets/ATLAS_tm_black.png" height="60" class="d-block mx-auto" />
      </div>
      <div>
        <p>
          The {{ shortName }} Matrix below shows the progression of tactics used in attacks as columns from left to right,
          with ML techniques belonging to each tactic below. Click on links to learn more about each item, or view
          {{ shortName }} tactics and techniques using the links at the top navigation bar.
        </p>

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
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    longName: name.long,
    mitreTitle: name.mitre,
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
