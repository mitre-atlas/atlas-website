<template>
  <v-list-item>
    <v-list-item>
      <v-list-item-content>
        {{ text }}
      </v-list-item-content>
    </v-list-item>
  </v-list-item>
</template>

<script>
export default {
  name: 'IndentedListItem',
  props: ['text']
}
</script>
