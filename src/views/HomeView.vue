<template>
  <div>
    <HomeHero/>

    <v-container>
      <v-row>
        <v-col :cols="!mdAndUp ? 12 : 9">

          <div class="my-10 text-subtitle-1">
            MITRE ATLAS™ (Adversarial Threat Landscape for Artificial-Intelligence Systems) is a globally accessible, living knowledge base of adversary tactics and techniques against Al-enabled svstems based on real-world attack observations and realistic demonstrations from Al red teams and security groups. ATLAS is modeled after and complementary to MITRE ATT&CK®, raising awareness of the rapidly evolving vulnerabilities of Al-enabled systems as they extend beyond cyber.
          </div>
        </v-col>
        <v-col class="" :cols="`${!mdAndUp ? 12 : 3}`">
          <img
            justify="center"
            src="../assets/compass.png"
            height="180"
            contain
          />
        </v-col>
      </v-row>

    <AtlasMatrix></AtlasMatrix>
    
    </v-container>
  </div>
</template>

<script setup lang="ts">
import AtlasMatrix from '@/components/matrix/AtlasMatrix.vue';
import HomeHero from '../components/HomeHero.vue';

import { useDisplay } from 'vuetify'

// mobile boolean for contitional rendering
const { mdAndUp } = useDisplay()

</script>
