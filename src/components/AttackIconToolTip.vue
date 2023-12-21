<template>
  <v-tooltip
    v-if="items.some((o) => 'ATT&CK-reference' in o)"
  >
    <template #activator="{ props }">
      <v-icon size="small" v-bind="props">
        mdi-information-outline
      </v-icon>
    </template>
    <span>
      <span class="attack-and">&</span>
      indicates an adaptation from ATT&CK
    </span>
  </v-tooltip>
</template>

<script setup>
const { items } = defineProps([
    /**
     * Data object type (e.g. tactics)
     * @type {String}
     */
    'items',
  ]);
</script>

<style>
  .attack-and {
    color: red;
    font-size: 12px;
    font-weight: normal;
    vertical-align: super;
  }
</style>
