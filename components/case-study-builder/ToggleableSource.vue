<!-- Reference/source for case study builder that toggles
between render with edit/delete and editable form. -->
<template>
  <div>
    <add-source
      v-if="isInEditMode"
      :url="source.url"
      :sourceDescription="source.sourceDescription"
      :addingSource="isInEditMode"
      :index="index"
      @clicked="replaceSource"
      @addingBoolUpdate="isInEditMode = $event"
    />
    <edit-source-list-item
      v-else
      :source="source"
      :index="index"
      v-on:edit-source="isInEditMode = $event"
      v-on:delete="$emit('delete', index)"
    />
  </div>
</template>
<script>
export default {
  name: 'ToggleableSource',
  props: [
    'source',
    'index'
  ],
  data: () => ({
    isInEditMode: false
  }),
  methods: {
    replaceSource (event) {
      // Close the add source dialog
      this.isInEditMode = false
      // Return the source object and index in references array
      this.$emit('clicked', event, this.index)
    }
  }
}
</script>
