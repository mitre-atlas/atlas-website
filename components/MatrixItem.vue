<template>
  <v-card>
    <v-card-title>{{ info.name }}</v-card-title>
    <v-card-subtitle>{{ info.id }}</v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: 'MatrixItem',
  props: ['info']
}
</script>
