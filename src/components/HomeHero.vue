<template>
  <div>
    <v-card
      class="pa-12 rounded-0"
      color="navy"
      width="100%"
    >
      <div class="ml-12 mr-12 mt-8 mb-6">
        <h1
          style="font-weight: bold; ; text-align: left"
          :class="`text-white ${mobile ? 'text-h2' : 'text-h1'}`"
        >
          MITRE ATLAS™
        </h1>
        <h2
        :class="`text-lightBlue ${mobile ? 'text-h6' : ' text-h4'}`"
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
import { useDisplay } from 'vuetify'

// mobile boolean for contitional rendering
const { mobile } = useDisplay()
</script>
