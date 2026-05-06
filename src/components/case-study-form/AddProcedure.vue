<template>
  <v-form ref="procedureForm" @submit.prevent>
    <v-card variant="flat">
      <div class="py-6">
        <div class="mb-6">
          <associated-type-selector type="tactics" v-model="procedureStep.tactic" :multiple="false" required
            label="Case Study Procedure Step Tactic"
            :hint="associatedTacticHint"
            :show-validation="formSubmitted || props.showValidation"
            :new-item-errors="tacticNewItemErrors" />
        </div>
        <div class="mb-6">
          <associated-type-selector type="techniques" v-model="procedureStep.technique" :multiple="false"
            :items="procedureTechniqueItems"
            required label="Case Study Procedure Step Technique"
            :hint="associatedTechniqueHint"
            :show-validation="formSubmitted || props.showValidation"
            :new-item-errors="techniqueNewItemErrors" />
        </div>
        <v-textarea label="Case Study Procedure Step Summary *"
          hint="Description of the procedure step" variant="outlined" v-model.trim="procedureStep.description" required
          :error="showDescriptionRequiredError" @update:focused="handleDescriptionFocused" />
      </div>
      <v-card-actions>
        <v-spacer />
        <template v-if="props.editProcedure">
          <v-btn @click="$emit('cancel')">Cancel</v-btn>
          <v-btn type="submit" color="green" @click="addProcedureStep()">Save</v-btn>
        </template>
        <v-btn v-else type="submit" variant="flat" icon="mdi-plus" rounded="lg" density="comfortable" color="info"
          :disabled="isAddDisabled" @click="addProcedureStep()" />
      </v-card-actions>
      <v-alert v-if="formSubmitted && isProcedureFormValid === false" icon="mdi-alert" color="red-lighten-4">
        Please fill out all required fields.
      </v-alert>
    </v-card>
  </v-form>
</template>

<script setup>
import { reactive, computed, nextTick, ref, onMounted, watch } from 'vue'
import { useMain } from '@/stores/main'
import { validateUrl } from '@/assets/tools'
import AssociatedTypeSelector from '../contribute-form/AssociatedTypeSelector.vue'

const props = defineProps({
  /**
   * Individual procedure being edited
   * @type {Object}
   */
  editProcedure: {
    type: Object,
    default: null,
  },
  /**
   * Index of procedure being edited
   * @type {Number}
   */
  editIndex: {
    type: Number,
    default: null,
  },
  showValidation: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel()

onMounted(() => {
  if (props.editProcedure) {
    procedureStep.value.tactic = props.editProcedure.tactic
    procedureStep.value.technique =
      typeof props.editProcedure.technique === 'string' &&
      mainStore.getDataObjectById(props.editProcedure.technique) === undefined
        ? ''
        : props.editProcedure.technique
    procedureStep.value.description = props.editProcedure.description
  }
})

const mainStore = useMain()

const formSubmitted = ref(false)
const procedureForm = ref(null)
const descriptionTouched = ref(false)
const associatedTacticHint = 'Select an ATLAS tactic, OR to suggest a new tactic, click the “Add New Tactic” button in the dropdown menu'
const associatedTechniqueHint = 'Select an ATLAS technique, OR to suggest a new technique, click the “Add New Technique” button in the dropdown menu'
const isProcedureFormValid = computed(() => {
  if (!formSubmitted.value) return true
  return isProcedureStepValid.value
})

const fallbackProcedureStep = reactive(createEmptyProcedureStep())
const procedureStep = computed(() => {
  return model.value ?? fallbackProcedureStep
})

const showDescriptionRequiredError = computed(
  () => !procedureStep.value.description?.trim() &&
    (descriptionTouched.value || formSubmitted.value || props.showValidation)
)

const hasProcedureContent = computed(() => {
  return Boolean(
    procedureStep.value.tactic ||
    procedureStep.value.technique ||
    procedureStep.value.description?.trim()
  )
})

const isProcedureStepValid = computed(() => {
  return Boolean(
    isProcedureAssociatedValueValid(procedureStep.value.tactic) &&
    isProcedureAssociatedValueValid(procedureStep.value.technique) &&
    procedureStep.value.description?.trim()
  )
})

const isAddDisabled = computed(() => !hasProcedureContent.value || !isProcedureStepValid.value)

const tacticNewItemErrors = computed(() => getProcedureAssociatedErrors(procedureStep.value.tactic))
const techniqueNewItemErrors = computed(() => getProcedureAssociatedErrors(procedureStep.value.technique))

const procedureTechniqueItems = computed(() => {
  if (!procedureStep.value.tactic) return []
  if (isDraftItem(procedureStep.value.tactic)) return mainStore.getDataObjectsByType('techniques', 'ATLAS')

  const parentTechniques = mainStore.getDataObjectsByTypeKeyContainingValue(
    'techniques',
    'tactics',
    procedureStep.value.tactic,
    'ATLAS'
  )

  return parentTechniques.flatMap((technique) => [
    technique,
    ...(technique.subtechniques ?? []),
  ])
})

function handleDescriptionFocused(focused) {
  if (!focused) descriptionTouched.value = true
}

function isDraftItem(value) {
  return value && typeof value === 'object' && value.id === 'new'
}

function isProcedureAssociatedValueValid(value) {
  if (!value) return false
  if (!isDraftItem(value)) return true

  return Boolean(
    value.name?.trim() &&
    value.summary?.trim() &&
    validateUrl(value.referenceLink) === true
  )
}

function getProcedureAssociatedErrors(value) {
  const errors = {}
  if (!isDraftItem(value)) return errors

  if (!value.name?.trim()) errors.name = ['Name is required.']
  if (!value.summary?.trim()) errors.summary = ['Summary is required.']

  const referenceLinkError = validateUrl(value.referenceLink)
  if (referenceLinkError !== true) errors.referenceLink = [referenceLinkError]

  return errors
}

// changing tactic should clear out technique field
watch(
  () => procedureStep.value.tactic,
  (newVal, oldVal) => {
    if (procedureStep.value.technique && newVal !== oldVal && !!oldVal) {
      procedureStep.value.technique = ''
    }
  }
)

const emit = defineEmits(['submitProcedureStep', 'cancel', 'updateShowAddNewStep', 'update'])

defineExpose({
  addProcedureStep
})

async function addProcedureStep() {
  formSubmitted.value = true
  procedureForm.value?.validate()
  const copy = JSON.parse(JSON.stringify(procedureStep.value))
  const hasParentModel = !!model.value

  if (isProcedureFormValid.value && props.editProcedure) {
    emit('update', copy, props.editIndex)
    formSubmitted.value = false
    descriptionTouched.value = false
  } else if (isProcedureFormValid.value) {
    emit('submitProcedureStep', copy)
    if (!hasParentModel) resetProcedureStep()
    formSubmitted.value = false
    descriptionTouched.value = false
    await nextTick()
    procedureForm.value?.resetValidation()
  }
}

function createEmptyProcedureStep() {
  return {
    tactic: '',
    technique: '',
    description: '',
  }
}

function resetProcedureStep() {
  const emptyProcedureStep = createEmptyProcedureStep()

  if (model.value) {
    Object.assign(model.value, emptyProcedureStep)
    return
  }

  Object.assign(fallbackProcedureStep, emptyProcedureStep)
}
</script>
