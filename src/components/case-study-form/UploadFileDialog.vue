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
            Loading a file will <b>overwrite any existing progress</b> in the form. The current 
            case study schema version is {{ `v${schema.$version}` }}
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
            <v-btn
              text="Cancel"
              @click="selectedFile = []; isActive.value = false"
            />
            <v-btn
              text="Ok"
              type="submit"
              @click="emitData()"
            />
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>

<script setup>
  import schema from '/public/atlas-data/dist/schemas/atlas_website_case_study_schema.json'
  import { generateID, validFormatYAML } from '@/assets/tools.js'
  import { CORE_SCHEMA, load } from 'js-yaml'
  import { reactive, ref, watch } from 'vue'

  let initialFilename = ''

  const selectedFile = ref()

  watch(selectedFile, () => {
    validateCount = 0
    yamlErrors.value = false
    errorMessages = []
    form.value.resetValidation()
  })

  function requiredRule(fileArray) {
    return fileArray.length === 1 || `Required`
  }

  let validateCount = 0

  function typeRule(fileArray) {
    validateCount ++
    const file = fileArray[0]
    const expectedTypes = ['.yaml']
    let fileType = ''
    const extStartIndex = file?.name.lastIndexOf('.')
      if (extStartIndex >= 0) {
        fileType = file.name.slice(extStartIndex)
        if (validateCount === 1) {
          // grab name before it is overwritten with id
          initialFilename = file.name.substring(0, extStartIndex)
        }
      }

      // Check file extension (though accept prop is in effect)
      // Rename file name to prevent XSS
      if (expectedTypes.includes(fileType)) {
        // https://blog.yeswehack.com/yeswerhackers/file-upload-attacks-part-2/

        Object.defineProperty(file, 'name', { // prevents buffer overflow attack via name prop
          writable: true,
          value: generateID() + '.yaml'
        })
        return true
      } else {
        return `Invalid file type: expected .yaml, got ${fileType}`
      }
  }

  function sizeRule(fileArray) {
    const file = fileArray[0]
    const MB_TO_B = 1000000
    const megabyteLimit = 2
    const maxSize = MB_TO_B * megabyteLimit // the last number is in megabytes, the first converts it to bytes
    const fileSize = file.size
    if (fileSize <= 0) {
      return 'Invalid file'
    } else if (fileSize <= maxSize) {
      return true
    } else {
      return `File too large, (${megabyteLimit} MB limit)`
    }
  }

  let errorMessages = reactive([])
  let uploadedFile = reactive({})
  const isFormValid = ref()
  let yamlErrors = ref(false)
  let showDialog = ref(false)

  async function validJsonRule(fileArray) {
    const file = fileArray[0]
    const tryYamlText = await file.text()
      try {
        errorMessages = []
        yamlErrors.value = false
        uploadedFile = load(tryYamlText, { schema: CORE_SCHEMA })
        const yamlErr = validFormatYAML(uploadedFile)
        for (let i = 0; i < yamlErr.length; i++) {
          errorMessages.push(yamlErr[i])
        }
        if(yamlErr) {
          yamlErrors.value = true
          return ''
        }
        else return true
      } catch (yamlErr) {
        return yamlErr.reason
      }
  }
  
  const emit = defineEmits(['submit'])

  const form = ref(null)

  async function emitData() {
    await form.value.validate()
    if(isFormValid.value) {
      emit('submit', uploadedFile, initialFilename)
      selectedFile.value = []
      showDialog.value = false
    }
  }

</script>