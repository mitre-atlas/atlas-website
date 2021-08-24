<!-- Editable source item with edit and delete buttons -->
<template>
  <v-list-item>
    <v-card-actions>
      <div>{{ number }}.</div>
    </v-card-actions>
    <v-list-item-content>
      <ref-source :source="source" />
    </v-list-item-content>
    <v-card-action>
      <v-btn color="blue" icon v-on:click="$emit('edit-source', true)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <template v-slot:activator="{ on, attrs }">
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
          v-on:cancel="dialog = false"
          v-on:delete="deleteSource"
        >
          <ref-source :source="source" />
        </confirm-delete-dialog>
      </v-dialog>

    </v-card-action>
  </v-list-item>
</template>
<script>
export default {
  name: 'EditSourceListItem',
  props: [
    'source',
    'index'
  ],
  data: () => ({
    dialog: false
  }),
  computed: {
    number () {
      return this.index + 1
    }
  },
  methods: {
    deleteSource () {
      // Close the dialog
      this.dialog = false
      // Emit the delete
      this.$emit('delete')
    }
  }
}
</script>
