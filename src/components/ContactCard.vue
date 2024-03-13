<template>
  <v-card
    class="pa-4 d-flex flex-column fill-height rounded-lg"
    :href="item.link"
    target="_blank"
    dark
    variant="flat"
    color="grey-lighten-4"
  >
    <div class="d-flex flex-no-wrap align-center">
      <div size="72">
        <v-icon size="large" :color="item.color">
          {{ item.icon }}
        </v-icon>
      </div>

      <div>
        <v-card-title class="text-h6 pt-0 text-wrap" v-text="item.title"> </v-card-title>
        <v-card-subtitle class="text-wrap">
          {{ item.text }}
        </v-card-subtitle>
      </div>
    </div>
  </v-card>
</template>

<script setup>
/**
 * List of information to be rendered on the card
 * @type {Object}
 */
const { item } = defineProps(['item'])
</script>
