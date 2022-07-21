<!-- Delete confirmation dialog, displaying a slot -->
<template>
  <v-card>
    <v-card-title>
      Delete "{{ name }}"?
    </v-card-title>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn class="ma-1" color="grey" text @click="$emit('cancel')">
        Cancel
      </v-btn>
      <v-btn class="ma-1" color="error" text @click="$emit('delete')">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'ConfirmDeleteDialog',
  props: ['name']
}
</script>
