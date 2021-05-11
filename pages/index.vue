<template>
  <div>
    <page-title>{{ title }}</page-title>

    <v-row>
      <v-col cols="8">
    <p class="mb-10">
    The AdvML Threat Matrix is a knowledge base of adversarial tactics and techniques for machine learning (ML) security based on <a href="https://attack.mitre.org" style="text-decoration: none;">the ATT&CK framework</a>.
    Along with case studies demonstrating attacks on machine learning systems, this knowledge base is for both the ML and security communities to better understand ML threats.
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
        <span><a href="https://navigator.lt.mitre.org" style="text-decoration: none;">View on ATT&CK Navigator</a><v-icon small>mdi-open-in-new</v-icon></span>
      </div>
      </v-col>
    </v-row>

    <v-row>
      <matrix-attack-style :matrix="this.$store.getters.getMatrix" />
    </v-row>
  </div>
  <!-- <div class="index-homepage"> -->
    <!-- <nuxt-content :document="page" /> -->
    <!-- <div>
      <h1>Adversarial Machine Learning</h1>
      <p>The goal of this project is to position attacks on machine learning (ML) systems in an ATT@CK-style framework so that security analysts can orient themselves to these new and upcoming threats.</p>
      <p>If you are new to how ML systems can be attacked, we suggest starting at this no-frills Advesarial ML 101 Aimed at securty analysts.</p>
      <p>Of if you want to dive right in, head to Adversarial ML Threat Matrix</p>
    </div> -->
  <!-- </div> -->
</template>

<script>
export default {
  data: () => ({
    title: 'Adversarial Machine Learning Threat Matrix'
  }),
  async asyncData ({ $content }) {
    const page = await $content('adversarial-ml-threat-matrix').fetch()

    return {
      page
    }
  }

  // Populate store upon start
  // async fetch () {
  //   await this.$store.dispatch('getTactics')
  //   // await this.$store.dispatch('getTechniques')
  //   // await this.$store.dispatch('getCaseStudies')

  //   console.log(this.$store.state.tactics.length)
  // }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
</style>
