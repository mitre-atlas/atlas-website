<template>
  <v-list
    height="500"
    dense
    >
    <div
      v-for="(technique, i) in techniques"
      :key="i">
      <v-list-group v-if="'subtechniques' in technique">
        <template v-slot:activator>
          <matrix-technique-content :technique="technique" />
        </template>

        <v-list-item
          v-for="(subtechnique, i) in technique.subtechniques"
          :key="i"
        >
          <!-- This nested v-list-item will be indented -->
          <matrix-technique-item :technique="subtechnique" />
        </v-list-item>
      </v-list-group>

      <v-list-item-group v-else>
        <matrix-technique-item :technique="technique" />
      </v-list-item-group>

      <v-divider />
    </div>
  </v-list>
</template>

<script>
export default {
  name: 'MatrixTechniqueList',
  props: ['techniques']
}
</script>

<style scoped>
.v-list {
  overflow: scroll;
}
</style>
