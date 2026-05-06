<template>
  <v-list v-if="sources.length" variant="flat">
    <div v-for="(source, i) in sources" :key="i">
      <div v-if="i === editIndex" v-click-outside="closeEdit">
        <AddSource
          v-model="editSourceDraft"
          :editIndex="editIndex"
          :type="type"
        />
      </div>
      <v-list-item v-else :key="i" :clickable="false" :ripple="false">
        {{ i + 1 }}.

        <template v-if="!source.url">
          <v-tooltip
            :text="getReferenceDisplayText(source)"
            location="top"
            :disabled="getReferenceDisplayText(source, referenceDisplayMaxChars) === getReferenceDisplayText(source)"
          >
            <template #activator="{ props }">
              <span v-bind="props">
                {{ getReferenceDisplayText(source, referenceDisplayMaxChars) }}
              </span>
            </template>
          </v-tooltip>
        </template>

        <template v-else>
          <v-tooltip
            :text="getReferenceDisplayText(source)"
            location="top"
            :disabled="getReferenceDisplayText(source, referenceDisplayMaxChars) === getReferenceDisplayText(source)"
          >
            <template #activator="{ props }">
              <a v-bind="props" :href="source.url" target="_blank">
                {{ getReferenceDisplayText(source, referenceDisplayMaxChars) }}
              </a>
            </template>
          </v-tooltip>
          <v-icon icon="mdi-open-in-new" size="x-small" class="opacity-100 ml-1" />
        </template>

        <template v-slot:append>
          <v-icon
            icon="mdi-pencil"
            color="#2D4863"
            class="opacity-100 mr-5"
            @click="startEdit(i, source)"
          />
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" icon="mdi-delete-outline" color="#2D4863" class="opacity-100" />
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title class="text-wrap">
                  Delete {{ getReferenceDisplayText(source) }}?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
                  <v-btn text="Delete" color="red" @click="emitDelete(i, isActive)"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-list-item>
    </div>
  </v-list>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ClickOutside as vClickOutside } from 'vuetify/directives'
import AddSource from '@/components/case-study-form/AddSource.vue'
import { getReferenceDisplayText } from '@/assets/tools'
import { REFERENCE_DISPLAY_MAX_CHARS, type Reference } from '@/types/reference'

const emit = defineEmits<{
  (e: 'updateSource', payload: Reference, index: number): void
  (e: 'delete', index: number): void
}>()

const { sources, type } = defineProps<{
  sources: Reference[]
  type: string
}>()

const editIndex = ref<number | null>(null)
const editSourceDraft = ref<Reference>({
  title: '',
  url: ''
})

watch(editSourceDraft, (source) => {
  if (editIndex.value === null) return

  if (!hasReferenceContent(source)) {
    const deleteIndex = editIndex.value
    editIndex.value = null
    emit('delete', deleteIndex)
    return
  }

  emit('updateSource', { ...source }, editIndex.value)
}, { deep: true })

function hasReferenceContent(source: Reference) {
  return !!source.title?.trim() || !!source.url?.trim()
}

function startEdit(index: number, source: Reference) {
  if (editIndex.value === index) {
    closeEdit()
    return
  }

  editIndex.value = null
  editSourceDraft.value = {
    title: source.title ?? '',
    url: source.url ?? ''
  }
  editIndex.value = index
}

function closeEdit() {
  editIndex.value = null
}

function emitDelete(deleteIndex: number, dialogIsActive: { value: boolean }) {
  emit('delete', deleteIndex)
  if (editIndex.value === deleteIndex) {
    editIndex.value = null
  } else if (editIndex.value !== null && editIndex.value > deleteIndex) {
    editIndex.value--
  }

  dialogIsActive.value = false
}

const referenceDisplayMaxChars = REFERENCE_DISPLAY_MAX_CHARS
</script>
