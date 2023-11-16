<template>
  <div>
    <v-card
      class="pa-12"
      color="navy"
      tile
      width="100%"
    >
      <div class="ml-12 mr-12 mt-8 mb-6">
        <h1
          style="font-weight: bold; ; text-align: left"
          class="white--text text-h1"
        >
          MITRE ATLAS
        </h1>
        <h2
          class="lightBlue--text text-h4"
          style="font-weight: bold; text-align: left"
        >
          NAVIGATING THE LANDSCAPE OF THREATS <br>
          TO MACHINE LEARNING SYSTEMS
        </h2>
      </div>
    </v-card>
  </div>
</template>

<script setup lang='ts'>
import { useDisplay } from "vuetify";
import { computed } from 'vue' 

const display = useDisplay();

const mobile = computed(() => {
  return display.mobile.value;
});

</script>
