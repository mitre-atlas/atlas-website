<template>
  <div>
    <v-row class="tw-prose tw-max-w-none">
      <v-col cols="12">
        <div class="my-10">
          <p class="pb-5">

              {{ mitreTitle }} ({{ longName }}) is a globally accessible, living knowledge base of adversary tactics and techniques based on real-world attack observations and realistic demonstrations from AI red teams and security groups. There are a growing number of vulnerabilities in AI-enabled systems, as <NuxtLink to="resources/adversarial-ml-101">the incorporation of AI increases the attack surface of existing systems</NuxtLink> beyond those of traditional cyber-attacks. We developed ATLAS to raise awareness of these unique and evolving vulnerabilities, as the global community starts to incorporate AI into more systems. ATLAS is modeled after <a
              href="https://attack.mitre.org"
            >the MITRE ATT&CK<sup>&reg;</sup> framework</a> and its tactics, techniques, and procedures (TTPs) are complementary to those in ATT&CK.

          </p>

          <v-img
            :src="require('~/assets/ATLAS_tm_black.png')"
            height="60"
            contain
          />
          <!-- <img src="~/assets/ATLAS_tm_black.png" height="60" class="d-block mx-auto mt-10"> -->
        </div>
        <div>
          <p>

              The {{ shortName }} Matrix below shows the general progression of attack tactics as column headers from left to right, with attack techniques organized below each tactic. <span class="attack-and">&</span>&nbsp;indicates a tactic or technique directly adapted from from ATT&CK. Click on the blue links to learn more about each item, or search and view more details about {{ shortName }}  tactics and techniques using the links in the top navigation bar.

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
// ATLAS home page
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    longName: name.long,
    mitreTitle: name.mitre,
    title: name.long
  }),
  computed: {
    // Populate tactics in matrix navigator
    populatedTactics () {
      return this.$store.getters.getDataObjectsByType('tactics', 'ATLAS')
    }
  }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
</style>
