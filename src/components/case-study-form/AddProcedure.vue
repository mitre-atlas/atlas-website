<template>
  <v-form ref="procedureForm" @submit.prevent>
    <v-card
      title="Add Procedure Step"
      variant="outlined"
      :style="{ borderColor: isProcedureFormValid ? 'grey' : 'red' }"
    >
      <v-row class="pa-6">
        <v-col cols="12" lg="6">
          <v-autocomplete
            label="Tactic"
            :items="tactics"
            item-title="name"
            item-value="id"
            v-model="procedureStep.tactic"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            :rules="requiredRule"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <v-autocomplete
            label="Technique"
            :items="mapTechAndSub"
            item-title="name"
            item-value="id"
            v-model="procedureStep.technique"
            :disabled="!procedureStep.tactic"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            :rules="requiredRule"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.raw.tactics ? '' : 'mdi-subdirectory-arrow-right'"
              />
            </template>
          </v-autocomplete>
        </v-col>
        <v-textarea
          label="Description"
          prepend-inner-icon="mdi-text"
          hint="Describe how this technique was used in the case study"
          :disabled="!procedureStep.tactic"
          variant="outlined"
          v-model.trim="procedureStep.description"
          class="mx-3"
        />
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit(editProcedure ? 'cancel' : 'updateShowAddNewStep')">Cancel</v-btn>
        <v-btn type="submit" color="green" @click="addProcedureStep()"> Save </v-btn>
      </v-card-actions>
      <v-alert
        v-if="formSubmitted && isProcedureFormValid === false"
        icon="mdi-alert"
        color="red-lighten-4"
      >
        {{
          procedureStep.tactic
            ? 'Please fill out Technique'
            : 'Please fill out Tactic and Technique'
        }}
      </v-alert>
    </v-card>
  </v-form>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from 'vue'
import { useMain } from '@/stores/main'

const { editProcedure, editIndex } = defineProps([
  /**
   * Individual procedure being edited
   * @type {Object}
   */
  'editProcedure',
  /**
   * Index of procedure being edited
   * @type {Object}
   */
  'editIndex'
])

onMounted(() => {
  if (editProcedure) {
    procedureStep.tactic = editProcedure.tactic
    procedureStep.technique =
      mainStore.getDataObjectById(editProcedure.technique) === undefined
        ? ''
        : editProcedure.technique
    procedureStep.description = editProcedure.description
  }
})

const mainStore = useMain()

const formSubmitted = ref(false)
const procedureForm = ref(null)
const isProcedureFormValid = computed(() => {
  if (!formSubmitted.value) return true
  if (procedureStep.tactic && procedureStep.technique) return true
  return false
})

const requiredRule = [
  (value) => {
    if (value) return true
    return 'Required'
  }
]

let procedureStep = reactive({
  tactic: '',
  technique: '',
  description: ''
})

const tactics = computed(() => {
  return mainStore.getDataObjectsByType('tactics')
})

// changing tactic should clear out technique field
watch(
  () => procedureStep.tactic,
  (newVal, oldVal) => {
    if (procedureStep.technique && newVal !== oldVal && !!oldVal) {
      procedureStep.technique = ''
    }
  }
)

const mapTechAndSub = computed(() => {
  // Parent techniques that have the selected tactic as a parent
  const techs = mainStore.getDataObjectsByTypeKeyContainingValue(
    'techniques',
    'tactics',
    procedureStep.tactic
  )

  for (let i = 0; i < techs.length; i++) {
    // Add subtechniques, if exist
    if (techs[i].subtechniques) {
      for (let j = 0; j < techs[i].subtechniques.length; j++) {
        const subtechnique = techs[i].subtechniques[j]
        // Insert into techniques array below the parent technique and any prior subtechniques
        const index = i + 1 + j
        techs.splice(index, 0, subtechnique)
      }
    }
  }
  return techs
})

const emit = defineEmits(['submitProcedureStep', 'cancel', 'updateShowAddNewStep', 'update'])

defineExpose({
  addProcedureStep
})

function addProcedureStep() {
  formSubmitted.value = true
  procedureForm.value.validate()
  if (isProcedureFormValid.value && editProcedure) {
    const copy = JSON.parse(JSON.stringify(procedureStep))
    emit('update', copy, editIndex)
    formSubmitted.value = false
  } else if (isProcedureFormValid.value) {
    const copy = JSON.parse(JSON.stringify(procedureStep))
    emit('submitProcedureStep', copy)
    procedureForm.value.reset()
    formSubmitted.value = false
  }
}
</script>
