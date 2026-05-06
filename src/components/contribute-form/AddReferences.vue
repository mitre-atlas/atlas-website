<template>
    <SourceList :sources="displayReferences" :type="type" @delete="deleteSource" @updateSource="updateSource" />
    <AddSource ref="addFormRef" v-model="sourceDraft" @submit="startNextReference" :type="type" />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import AddSource from '../case-study-form/AddSource.vue'
import SourceList from '../case-study-form/SourceList.vue'
import type { Reference } from '@/types/reference'
import { isUrlValid } from '@/assets/tools'

const references = defineModel<Reference[]>({ required: true })
const addFormRef = ref<{ resetForm?: () => void; focusFirst?: () => void } | null>(null)
const sourceDraft = ref<Reference>(createEmptyReference())
const displayReferences = computed(() => references.value.filter((source) => source !== sourceDraft.value))

withDefaults(defineProps<{
  type?: string;
}>(), {
  type: ''
})

function createEmptyReference(): Reference {
    return {
        title: '',
        url: ''
    }
}

function hasReferenceContent(source: Reference) {
    return !!source.title?.trim() || !!source.url?.trim()
}

watch(sourceDraft, syncSourceDraft, { deep: true })

function syncSourceDraft(source: Reference) {
    const draftIndex = references.value.indexOf(source)

    if (hasReferenceContent(source)) {
        if (draftIndex === -1) references.value.push(source)
        return
    }

    if (draftIndex !== -1) references.value.splice(draftIndex, 1)
}

function startNextReference() {
    if (!hasReferenceContent(sourceDraft.value) || (!!sourceDraft.value.url && !isUrlValid(sourceDraft.value.url))) {
        return
    }

    sourceDraft.value = createEmptyReference()
    nextTick(() => addFormRef.value?.focusFirst?.())
}

function deleteSource(index: number) {
    references.value.splice(index, 1)
}

function updateSource(source: Reference, sourceIndex: number) {
    references.value[sourceIndex] = source
}

</script>
