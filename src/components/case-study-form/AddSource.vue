<template>
  <v-form 
    @submit.prevent
    v-model="isSourceFormValid"
  >
    <v-card
      variant="outlined"
      :title="`Source ${getIndex()}`"
    >
      <v-text-field
        v-model="source.title"
        label="Description"
        variant="outlined"
        hint="Brief description (optional)"
        prepend-inner-icon="mdi-file-edit-outline"
        class="pt-6 px-6 pb-3"
      />
      <v-text-field
        v-model.trim="source.url"
        label="URL"
        variant="outlined"
        hint="Link (optional)"
        prepend-inner-icon="mdi-link"
        class="px-6"
        :rules="validUrlRule"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit('cancel')">Cancel</v-btn>
        <v-btn 
          type="submit"
          color="green"
          @click="submit()"
        >
          Save
        </v-btn>
      </v-card-actions>
      <v-alert
        v-if="bothFieldsBlank"
        icon="mdi-alert" 
        color="red-lighten-4"
      >
        Please complete at least one field
      </v-alert>
    </v-card>
  </v-form>
</template>

<script setup>
  import { reactive, onMounted } from 'vue';
  import { ref, computed } from 'vue'

  const emit = defineEmits(['submit', 'cancel', 'delete', 'update'])
  const { sources, editSource, editIndex } = defineProps([
    /**
     * Array of sources already entered
     * @type {Array}
     */
    'sources',
    /**
     * Individual source object being edited
     * @type {Object}
     */
     'editSource',
    /**
     * Index of source being edited
     * @type {Number}
     */
     'editIndex',
  ])

  const isSourceFormValid = ref(false)

  const source = reactive({
    title: '',
    url: ''
  })

  onMounted(() => {
    if(editSource) {
      source.title = editSource.title
      source.url = editSource.url
    }
  })

  const validUrlRule = [
    value => {
      if (!value) return true;
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        return 'URL does not start with http(s)://';
      }
      if (/\s/.test(value.trim())) return 'URL should not contain spaces';
      try {
        new URL(value)
        return true
      } catch (error) {
        return 'URL is not valid'
      }
    },
  ]

  const bothFieldsBlank = ref(false)

  function submit() {
    if (!source.title && !source.url) {
      bothFieldsBlank.value = true
    }
    else if (isSourceFormValid.value && editSource) {
      emit('update', source, editIndex)
    }
    else if (isSourceFormValid.value) {
      emit('submit', source)
    }
  }

  function getIndex() {
    if(editSource) {
      return editIndex + 1
    } else {
      return sources.length + 1
    }
  }

</script>