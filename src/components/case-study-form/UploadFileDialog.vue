<template>
  <v-dialog width="500" v-model="showDialog">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        text="Load case study"
        prepend-icon="mdi-upload"
        color="blue"
        variant="text"
      />
    </template>
    <template v-slot:default="{ isActive }">
      <v-form @submit.prevent v-model="isFormValid" ref="form">
        <v-card title="Load Case Study">
          <v-card-text class="text-subtitle-2">
            To view or edit an existing case study, upload a .yaml file created by this website.
            Loading a file will <b>overwrite any existing progress</b> in the form. The current case
            study schema version is {{ `v${schema.$version}` }}
            <v-file-input
              label="Case study .yaml file"
              accept=".yaml"
              :rules="[requiredRule, typeRule, sizeRule, validJsonRule]"
              :error-messages="errorMessages"
              :error="yamlErrors"
              variant="outlined"
              density="compact"
              class="mt-6"
              v-model="selectedFile"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Cancel" @click="cancel(isActive)" />
            <v-btn text="Ok" type="submit" @click="emitData()" />
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>

<script setup>
import { caseStudySchema as schema } from '@/assets/schemas.js'
import { validFormatYAML } from '@/assets/tools.js'
import { CORE_SCHEMA, load } from 'js-yaml'
import { reactive, ref, watch } from 'vue'

let initialFilename = ''

const selectedFile = ref(null)

watch(selectedFile, () => {
  validateCount = 0
  yamlErrors.value = false
  errorMessages = []
  form.value.resetValidation()
})

function requiredRule(file) {
  return !!file || 'Required'
}

let validateCount = 0

function typeRule(file) {
  if (!file) return true
  validateCount++
  const expectedTypes = ['.yaml']

  const extStartIndex = file.name.lastIndexOf('.')
  const fileType = extStartIndex >= 0 ? file.name.slice(extStartIndex) : ''

  if (extStartIndex >= 0 && validateCount === 1) {
    initialFilename = file.name.substring(0, extStartIndex)
  }

  return expectedTypes.includes(fileType)
    ? true
    : `Invalid file type: expected .yaml, got ${fileType}`
}

function sizeRule(file) {
  if (!file) return true
  const maxSize = 2 * 1_000_000
  return file.size > 0 && file.size <= maxSize
    ? true
    : 'File too large, (2 MB limit)'
}

let errorMessages = reactive([])
let uploadedFile = reactive({})
const isFormValid = ref()
let yamlErrors = ref(false)
let showDialog = ref(false)

async function validJsonRule(file) {
  if (!file) return true
  const tryYamlText = await file.text()
  try {
    errorMessages = []
    yamlErrors.value = false
    uploadedFile = load(tryYamlText, { schema: CORE_SCHEMA })
    const yamlErr = validFormatYAML(uploadedFile)
    for (let i = 0; i < yamlErr.length; i++) {
      errorMessages.push(yamlErr[i])
    }
    if (yamlErr) {
      yamlErrors.value = true
      return ''
    } else return true
  } catch (yamlErr) {
    return yamlErr.reason
  }
}

const emit = defineEmits(['submit'])

const form = ref(null)

async function emitData() {
  await form.value.validate()
  if (isFormValid.value) {
    emit('submit', uploadedFile, initialFilename)
    selectedFile.value = null
    showDialog.value = false
  }
}

function cancel(dialogIsActive) {
  selectedFile.value = null
  dialogIsActive.value = false
}
</script>
