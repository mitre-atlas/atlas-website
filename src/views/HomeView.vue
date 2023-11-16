<template>
  <div>
    <HomeHero/>
    
    <div
      class="pt-10 pr-12 pl-12 pb-10"
    >
      <v-row
        color="white"
        tile
        class="pr-12 pl-12"
        width="100%"
        style="margin-bottom: 5%; text-align: left"
      >
        <v-col :cols="`${mobile ? 12 : 9}`">
          <h3
            style="font-weight: bold;"
            class="black--text pt-8 p-10 mt-8"
          >
            MITRE ATLAS™ (Adversarial Threat Landscape for Artificial-Intelligence Systems)  is a globally accessible, living knowledge base of adversary tactics and techniques against Al-enabled svstems based on real-world attack observations and realistic demonstrations from Al red teams and security groups. ATLAS is modeled after and complementary to MITRE ATT&CK®, raising awareness of the rapidly evolving vulnerabilities of Al-enabled systems as they extend beyond cyber.
          </h3>
        </v-col>
        <v-col class="pt-10 pr-12 pl-12 pb-10" :cols="`${mobile ? 12 : 3}`">
          <img
            justify="center"
            src="../assets/compass.png"
            height="180"
            contain
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import HomeHero from '../components/HomeHero.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    HomeHero,
  },
});
</script>
