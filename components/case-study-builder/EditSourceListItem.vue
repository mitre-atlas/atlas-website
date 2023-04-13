<template>
  <v-list-item>
    <v-card-actions>
      <div>{{ number }}.</div>
    </v-card-actions>
    <v-list-item-content>
      <ref-source :source="source" />
    </v-list-item-content>
    <v-card-actions>
      <!-- Emits true on edit button click -->
      <v-btn color="blue" icon @click="$emit('edit-source', true)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="red"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <confirm-delete-dialog
          name="reference"
          @cancel="dialog = false"
          @delete="deleteSource"
        >
          <ref-source :source="source" />
        </confirm-delete-dialog>
      </v-dialog>
    </v-card-actions>
  </v-list-item>
</template>
<script>
/**
 * Editable source item with edit and delete buttons
 */
export default {
  name: 'EditSourceListItem',
  props: [
    /**
     * Case study source object
     * ```
     * {
     *    title: str,
     *    url: str
     * }
     * ```
     * @type {Object}
     */
    'source',
    /**
     * Index of this source object in the list of sources
     * @type {Number}
     */
    'index'
  ],
  data: () => ({
    // Controls whether the delete confirmation dialog is open
    dialog: false
  }),
  computed: {
    /**
     * Number of this source object in the list (1-indexed)
     * @type {Number}
     */
    number () {
      return this.index + 1
    }
  },
  methods: {
    deleteSource () {
      // Close the dialog
      this.dialog = false
      // Emit on delete button click
      this.$emit('delete')
    }
  }
}
</script>
