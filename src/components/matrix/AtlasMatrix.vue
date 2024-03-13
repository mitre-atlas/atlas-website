<template>
  <div>
    <div class="mb-10">
      The ATLAS Matrix below shows the progression of tactics used in attacks as columns from left to right,
      with ML techniques belonging to each tactic below.
      <span class="attack-and">&</span>&nbsp;indicates an adaption from ATT&CK.
      Click on the blue links to learn more about each item, or search and view ATLAS tactics and techniques using the links at the top navigation bar.

      View the ATLAS matrix highlighted alongside ATT&CK Enterprise techniques on the
      <a target="_blank" :href="matrixNavigatorUrl">ATLAS Navigator</a>.
    </div>

    <MatrixAttackStyle :tactics="tactics" style="overflow: auto;"></MatrixAttackStyle>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMain } from "@/stores/main"
import MatrixAttackStyle from "./MatrixAttackStyle.vue";
import { constructNavigatorLayerGitHubUrl, constructNavigatorUrlToLayer } from '@/assets/tools.js'

const mainStore = useMain();

const tactics = computed(() => {
  return mainStore.getDataObjectsByType('tactics', 'ATLAS')
})


// Construct link to open the case study frequency Navigator layer on the ATLAS Navigator
const matrixLayerGitHubUrl = constructNavigatorLayerGitHubUrl('atlas_layer_matrix', 'dist/default-navigator-layers')
const matrixNavigatorUrl = constructNavigatorUrlToLayer(matrixLayerGitHubUrl)
</script>
