<template>
  <v-list-item-content>
    <v-list-item-title
      v-text="technique.name"
    ></v-list-item-title>
  </v-list-item-content>
</template>

<script>
export default {
  name: 'MatrixTechniqueContent',
  props: ['technique']
}
</script>
