<template>
  <v-text-field
    ref="descriptionRef"
    v-model.trim="descriptionModel"
    :label="descriptionLabel"
    variant="outlined"
    :hint="descriptionHint"
    :class="descriptionClass"
    persistent-hint
  />
  <v-text-field
    v-model.trim="linkModel"
    :label="linkLabel"
    variant="outlined"
    :hint="linkHint"
    :rules="urlRules"
    :error="linkError"
    :class="linkClass"
    persistent-hint
    @update:focused="emit('linkFocused', $event)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VTextField } from 'vuetify/components'
import { validateUrl } from '@/assets/tools'

const emit = defineEmits<{
  (e: 'linkFocused', focused: boolean): void
}>()

withDefaults(defineProps<{
  descriptionLabel?: string
  linkLabel?: string
  descriptionHint?: string
  linkHint?: string
  descriptionClass?: string
  linkClass?: string
  linkError?: boolean
}>(), {
  descriptionLabel: 'Reference Description',
  linkLabel: 'Reference Link',
  descriptionHint: '',
  linkHint: 'URL for the reference (optional)',
  descriptionClass: '',
  linkClass: '',
  linkError: false
})

const descriptionModel = defineModel<string>('description', { default: '' })
const linkModel = defineModel<string>('link', { default: '' })
const descriptionRef = ref<InstanceType<typeof VTextField> | null>(null)
const urlRules = [validateUrl]

function focusDescription() {
  descriptionRef.value?.focus?.()
}

defineExpose({ focusDescription })
</script>
