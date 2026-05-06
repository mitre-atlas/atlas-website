<template>
  <v-dialog
    v-model="showDialog"
    max-width="520"
  >
    <v-card class="pa-6 text-mediumNavy">
      <div class="d-flex justify-end mb-2">
        <v-btn
          aria-label="Close upload dialog"
          color="mediumNavy"
          density="comfortable"
          icon="mdi-close"
          variant="text"
          @click="close"
        />
      </div>
      <v-card-text class="text-center text-body-1 pa-0 mb-8">
        <p class="mb-4">
          Upload a .yaml or .yml file created by this website to view or edit your existing
          {{ typeWordLower }}.

          Uploading a file will <b>overwrite any existing progress</b> in the contribution form.
        </p>
      </v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-card-text class="pa-0 mb-8">
          <v-file-input
            v-model="selectedFile"
            :label="`${typeWord} .yaml file *`"
            required
            accept=".yaml,.yml"
            :rules="[typeRule, sizeRule, validYamlRule]"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-file"
          />
        </v-card-text>
      </v-form>
      <v-card-actions class="justify-center flex-wrap ga-8 pa-0">
        <VAtlasBtnSecondary size="large" width="195" @click="close">Cancel</VAtlasBtnSecondary>
        <VAtlasBtnPrimary size="large" width="195" :disabled="!canUploadFile" @click="emitData">
          Upload
        </VAtlasBtnPrimary>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { CORE_SCHEMA, load } from 'js-yaml'
import { computed, nextTick, ref, watch } from 'vue'
import {
  contributionObjectTypeFromKey,
  getContributionTypeKey,
  contributionTypeWordFromKey,
} from '@/assets/contributionTools.js'

const showDialog = defineModel({ type: Boolean, required: true })
const props = defineProps({
  typeKey: {
    type: String,
    default: 'other',
  },
})
const typeWord = computed(() => contributionTypeWordFromKey(props.typeKey))
const typeWordLower = computed(() => contributionTypeWordFromKey(props.typeKey, true))

const emit = defineEmits(['submit'])
const form = ref()
const isFormValid = ref()
let uploadedFile = null
const selectedFile = ref(null)
const selectedFileObject = computed(() => fileFromValue(selectedFile.value))
const hasSelectedFile = computed(() => !!selectedFileObject.value)
const canUploadFile = computed(() => hasSelectedFile.value && isFormValid.value !== false)
const contributionTypeMismatchMessage = `It seems the document you uploaded isn’t the expected contribution type. Please double-check and upload the correct .yaml file for this contribution type`

// Reset file selection and errors whenever the dialog is opened
watch(showDialog, (v) => {
  if (v) {
    selectedFile.value = null
    form.value?.resetValidation?.()
  }
})

function fileFromValue(val) {
  return Array.isArray(val) ? val?.[0] : val
}

function close() {
  showDialog.value = false
}

watch(selectedFile, async (file) => {
  uploadedFile = null
  if (!fileFromValue(file)) {
    form.value?.resetValidation?.()
    return
  }

  await nextTick()
  await form.value?.validate?.()
})

// Rules
const sizeRule = (val) => {
  const f = Array.isArray(val) ? val?.[0] : val
  if (!f || !f.size) return true
  const max = 5 * 1024 * 1024 // 5MB
  return f.size <= max || `File too large: max 5MB`
}
const typeRule = (val) => {
  const f = Array.isArray(val) ? val?.[0] : val
  if (!f) return true
  const fileType = typeof f?.name === 'string' ? f.name.slice(f.name.lastIndexOf('.')) : ''
  const expectedTypes = ['.yaml', '.yml']
  return expectedTypes.includes(fileType)
    ? true
    : `Invalid file type: expected .yaml or .yml, got ${fileType}`
}

function isEmptyYamlDocument(value) {
  return value == null || (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
}

const validYamlRule = async (val) => {
  try {
    const f = Array.isArray(val) ? val?.[0] : val
    if (!f) return true

    const text = await f.text()
    uploadedFile = load(text, { schema: CORE_SCHEMA })
    if (isEmptyYamlDocument(uploadedFile)) {
      uploadedFile = { 'object-type': contributionObjectTypeFromKey(props.typeKey) }
      return true
    }

    if (getContributionTypeKey(uploadedFile) !== props.typeKey) {
      return contributionTypeMismatchMessage
    }

    return true
  } catch (err) {
    return err?.reason || 'Unable to parse YAML'
  }
}

async function emitData() {
  const result = await form.value.validate()
  if (result?.valid && uploadedFile) {
    emit('submit', uploadedFile, selectedFileObject.value?.name || '')
    selectedFile.value = null
    close()
  }
}
</script>
