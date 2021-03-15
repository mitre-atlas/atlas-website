<template>
  <v-list-item>
    <matrix-technique-content :technique="technique" />
  </v-list-item>
</template>

<script>
import MatrixTechniqueContent from './MatrixTechniqueContent.vue'

export default {
  components: { MatrixTechniqueContent },
  name: 'MatrixTechniqueItem',
  props: ['technique']
}
</script>
