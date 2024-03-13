<template>
  <div>
    <div class="mb-10">
      The ATLAS Matrix below shows the progression of tactics used in attacks as columns from left to right,
      with ML techniques belonging to each tactic below.
      <span class="attack-and">&</span>&nbsp;indicates an adaption from ATT&CK.
      Click on the blue links to learn more about each item, or search and view ATLAS tactics and techniques using the links at the top navigation bar.
    </div>

    <MatrixAttackStyle :tactics="tactics" style="overflow: auto;"></MatrixAttackStyle>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMain } from "@/stores/main"
import MatrixAttackStyle from "./MatrixAttackStyle.vue";

const mainStore = useMain();

const tactics = computed(() => {
  return mainStore.getDataObjectsByType('tactics', 'ATLAS')
})
</script>
