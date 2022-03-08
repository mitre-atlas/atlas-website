<template>
  <v-list-item :href="`/techniques/${technique.id}`">
    <matrix-technique-content :technique="technique" />
  </v-list-item>
</template>

<script>
import MatrixTechniqueContent from './MatrixTechniqueContent.vue'

export default {
  name: 'MatrixTechniqueItem',
  components: { MatrixTechniqueContent },
  props: ['technique']
}
</script>
