<!-- Reference/source for case study builder that toggles
between render with edit/delete and editable form. -->
<template>
  <div class="toggleable_source">
    <add-source
      v-if="isInEditMode"
      :url="source.url"
      :title="source.title"
      :adding-source="isInEditMode"
      :index="index"
      @clicked="replaceSource"
      @addingBoolUpdate="isInEditMode = $event"
    />
    <edit-source-list-item
      v-else
      :source="source"
      :index="index"
      @edit-source="isInEditMode = $event"
      @delete="$emit('delete', index)"
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
