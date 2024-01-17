<template>
    <v-card
    class="pa-4"
    :color="item.color"
    :href="item.link"
    target="_blank"
    >
    <div class="d-flex flex-no-wrap align-center">
      <div
        size="72"
        >
        <v-icon
        light
          right
          large
          >
          {{ item.icon }}
        </v-icon>
    </div>

      <div>
        <v-card-title
          class="text-h6 pt-0"
          v-text="item.title"
          >
        </v-card-title>
        <v-card-subtitle
        class="text-body-1 text-white "
        >
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
  const { item } = defineProps(["item"]);
  
</script>
  
  