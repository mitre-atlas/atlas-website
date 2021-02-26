<template>
  <div class="index-homepage">
    <Header />
    <nuxt-content :document="page" />
    <!-- <div>
      <h1>Adversarial Machine Learning</h1>
      <p>The goal of this project is to position attacks on machine learning (ML) systems in an ATT@CK-style framework so that security analysts can orient themselves to these new and upcoming threats.</p>
      <p>If you are new to how ML systems can be attacked, we suggest starting at this no-frills Advesarial ML 101 Aimed at securty analysts.</p>
      <p>Of if you want to dive right in, head to Adversarial ML Threat Matrix</p>
    </div> -->
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: {
    Header
  },
  async asyncData ({ $content }) {
    const page = await $content('pages/adversarial-ml-threat-matrix').fetch()

    return {
      page
    }
  }
}
</script>

<style>

</style>
