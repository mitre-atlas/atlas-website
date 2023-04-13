<template>
  <div class="toggleable_source">
    <add-source
      v-if="isInEditMode"
      :submission-status="(enableStatusHighlighting && wasInEditMode) ? {type: 'warning', message: 'Unsaved changes'} : {}"
      :url="source.url"
      :title="source.title"
      :adding-source="isInEditMode"
      :index="index"
      @clicked="replaceSource"
      @addingBoolUpdate="updateEditingState"
    />
    <!--
    Bubbles up from EditSourceListItem
    @arg {Number} index - Index of this source item
    -->
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
/**
 * Represents a source for case study builder that toggles
 * between display with edit/delete buttons and an editable form.
 */
export default {
  name: 'ToggleableSource',
  // props: [
  //   'source',
  //   'index',
  //   'enableStatusHighlighting'
  // ],
  props: {
    /**
     * Object representing the source.
     */
    source: {
      type: Object,
      default () {
        return {
          title: '',
          url: ''
        }
      }
    },
    /**
     * Index of this source in the references list
     */
    index: {
      type: Number,
      default: 0
    },
    /**
     * Whether to highlight the box for warning or error status
     */
    enableStatusHighlighting: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    /**
     * Whether this component is currently being edited
     */
    isInEditMode: false,
    /**
     * Whether this component was previously being edited
     * `@todo LW is this a flip side of the above?`
     */
    wasInEditMode: false
  }),
  methods: {
    /**
     * Updates edit states and emits current state as the `isEditing` event.
     *
     * @param {Boolean} newEditState
     */
    updateEditingState (newEditState) {
      this.wasInEditMode = false
      this.isInEditMode = newEditState
      /**
       * Emits the new edit state.  If false, the editor closes.

       * @arg {Boolean} newEditState
       */
      this.$emit('isEditing', newEditState)
    },
    /**
     * Closes the editor and replaces the source item
     * @param {Object} event - This source item
     */
    replaceSource (event) {
      // Close the add source dialog
      this.isInEditMode = false
      this.$emit('isEditing', false)

      /**
       * Return the source object and index in references array
       * @arg {Object} event - This source item
       * @arg {Number} index - Index of source in the list
       */
      this.$emit('clicked', event, this.index)
    }
  }
}
</script>
