<template>
  <v-form ref="formRef" @submit.prevent="handleAdd" validate-on="input">
    <v-card variant="flat" class="overflow-visible">
      <ReferenceFields
        ref="referenceFieldsRef"
        v-model:description="source.title"
        v-model:link="source.url"
        :description-hint="`Brief description of the reference and its relevance to the ${typeWord} (optional)`"
        description-class="pb-3"
      />
      <div v-if="!isEditing" class="w-100 text-end mt-3">
        <v-btn
          type="submit"
          variant="flat"
          icon="mdi-plus"
          rounded="lg"
          density="comfortable"
          color="info"
          :disabled="isAddDisabled"
        />
      </div>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { contributionTypeWordFromKey } from '@/assets/contributionTools'
import { VForm } from 'vuetify/components'
import type { Reference } from '@/types/reference'
import { isUrlValid } from '@/assets/tools'
import ReferenceFields from '@/components/ReferenceFields.vue'

type VFormInstance = InstanceType<typeof VForm>

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const props = withDefaults(defineProps<{
  /** Index of source being edited */
  editIndex?: number

  /** Parent type of object to which this resources will belong */
  type?: string
}>(), {
  type: ''
})

const source = defineModel<Reference>({ required: true })
const typeWord = computed(() => contributionTypeWordFromKey(props.type, true))

const formRef = ref<VFormInstance | null>(null)
const referenceFieldsRef = ref<{ focusDescription?: () => void } | null>(null)

const isEditing = computed(() => typeof props.editIndex === 'number')
const hasSourceContent = computed(() => {
  return !!source.value.title?.trim() || !!source.value.url?.trim()
})
const isAddDisabled = computed(() => {
  return !hasSourceContent.value || (!!source.value.url && !isUrlValid(source.value.url))
})

async function handleAdd() {
  if (isEditing.value || isAddDisabled.value) return

  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('submit')
  await nextTick()
  focusFirst()
}

function resetForm() {
  source.value = {
    title: '',
    url: ''
  }
  formRef.value?.resetValidation()
}

function focusFirst() {
  referenceFieldsRef.value?.focusDescription?.()
}

defineExpose({ resetForm, focusFirst })
</script>
