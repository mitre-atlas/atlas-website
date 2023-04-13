<template>
  <v-card>
    <v-card-title>
      Delete "{{ name }}"?
    </v-card-title>

    <v-card-text>
      <!-- Content to be displayed in the delete card -->
      <slot />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <!-- Cancel button clicked -->
      <v-btn class="ma-1" color="grey" text @click="$emit('cancel')">
        Cancel
      </v-btn>
      <!-- Delete button clicked -->
      <v-btn class="ma-1" color="error" text @click="$emit('delete')">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
/**
 * Delete confirmation dialog, displaying a slot
 */
export default {
  name: 'ConfirmDeleteDialog',
  props: [
    /**
     * Name of item to be deleted, for header prompt
     * @type {String}
     */
    'name'
  ]
}
</script>
