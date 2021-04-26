<template>
  <div>
    <div class="text-h2">{{ title }}</div>
    <p>{{ description }}</p>

    <v-row>
      <matrix-attack-style :matrix="getMatrix" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    title: 'Adversarial ML Matrix',
    description:
      'Below are the tactics and techniques representing the adversarial machine learning threat matrix.',
    useAttackStyle: false
  }),
  computed: {
    ...mapGetters(['getMatrix', 'getTacticStyling'])
  }
}
</script>

<style scoped>
.row {
  overflow: scroll;
}
</style>
