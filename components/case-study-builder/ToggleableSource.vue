<!-- Reference/source for case study builder that toggles
between render with edit/delete and editable form. -->
<template>
  <div class="toggleable_source">
    <add-source
      v-if="isInEditMode"
      :submission-status="enableStatusHighlighting ? {type: 'warning', message: 'Unsaved changes'} : {}"
      :url="source.url"
      :title="source.title"
      :adding-source="isInEditMode"
      :index="index"
      @clicked="replaceSource"
      @addingBoolUpdate="updateEditingState"
    />
    <edit-source-list-item
      v-else
      :source="source"
      :index="index"
      @edit-source="updateEditingState"
      @delete="$emit('delete', index)"
    />
  </div>
</template>
<script>
export default {
  name: 'ToggleableSource',
  props: [
    'source',
    'index',
    'enableStatusHighlighting'
  ],
  data: () => ({
    isInEditMode: false
  }),
  methods: {
    updateEditingState (newEditState) {
      this.isInEditMode = newEditState
      this.$emit('isEditing', newEditState)
    },
    replaceSource (event) {
      // Close the add source dialog
      this.isInEditMode = false
      this.$emit('isEditing', false)
      // Return the source object and index in references array
      this.$emit('clicked', event, this.index)
    }
  }
}
</script>
