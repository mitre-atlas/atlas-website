<!-- Nested v-list-item for an indented style  -->

<template>
  <div>
    <v-list-item v-for="(item, i) in computedItemList" :key="i">
      <v-list-item>
        <v-list-item-title>
          {{ item }}
        </v-list-item-title>
      </v-list-item>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: 'StudyDetailsListItem',
  props: ['itemList'],
  computed: {
    computedItemList () {
      // If passed a string, convert to a one-item list
      return Array.isArray(this.itemList) ? this.itemList : [this.itemList]
    },
    hasMultipleItems () {
      return Array.isArray(this.itemList) && this.itemList.length > 1
    }
  }
}
</script>

<style scoped>
.v-list-item__title {
  /* Wrap long titles where possible */
  white-space: normal;
}
</style>
