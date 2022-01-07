<!-- Nested v-list-item for an indented style  -->

<template>
  <div>
    <v-list-item>
      <v-list-item>
        <v-list-item-title>
          <slot />
        </v-list-item-title>
      </v-list-item>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: 'StudyDetailsListItem'
}
</script>

<style scoped>
.v-list-item__title {
  /* Wrap long titles where possible */
  white-space: normal;
}
</style>
