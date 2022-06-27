<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="my-10">
          <p>
            {{ mitreTitle }} ({{ longName }}), is a knowledge base of adversary tactics, techniques, and case studies for machine learning (ML) systems based on real-world observations, demonstrations from ML red teams and security groups, and the state of the possible from academic research. {{ shortName }} is modeled after the <a href="https://attack.mitre.org">MITRE ATT&CK<sup>&reg;</sup> framework</a> and its tactics and techniques are complementary to those in ATT&CK.
          </p>

          <p>
            {{ shortName }} enables researchers to navigate the landscape of <NuxtLink to="resources/adversarial-ml-101">
              threats to machine learning systems
            </NuxtLink>. ML is increasingly used across a variety of industries. There are a growing number of vulnerabilities in ML, and its use increases the attack surface of existing systems. We developed {{ shortName }} to raise awareness of these threats and present them in a way familiar to security researchers.
          </p>
          <img src="~/assets/ATLAS_tm_black.png" height="60" class="d-block mx-auto">
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
      <matrix-attack-style :tactics="populatedTactics" />
    </v-row>
  </div>
</template>

<script>
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    longName: name.long,
    mitreTitle: name.mitre,
    title: name.long
  }),
  computed: {
    populatedTactics () {
      return Object.values(this.$store.state.data.objects.tactics)[0]
    }
  }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
</style>
