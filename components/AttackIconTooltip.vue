<template>
  <v-tooltip
    v-if="items.some((o) => 'ATT&CK-reference' in o)"
    right
    color="grey lighten-4"
  >
    <template #activator="{ on, attrs }">
      <v-icon small v-bind="attrs" v-on="on">
        mdi-information-outline
      </v-icon>
    </template>
    <span style="color: #424242">
      <span class="attack-and">&</span>
      indicates an adaptation from ATT&CK
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'AttackIconTooltip',
  props: [
    /**
     * List of data objects
     * @type {Object[]}
     */
    'items'
  ]
}
</script>
