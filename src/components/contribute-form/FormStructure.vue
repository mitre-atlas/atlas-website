<template>
  <v-defaults-provider :defaults="formFieldDefaults">
    <v-form ref="formRef" v-model="isVuetifyFormValid" validate-on="input">
    <div
      v-for="section in props.sections[props.type]"
      :key="section.id"
      class="section-container large-floating-labels"
      :class="{ 'save-send-section': section.id === 'save-send' }"
    >
      <h3 class="section-header section-anchor" :id="section.id" v-if="props.type !== 'other'">{{ section.title }}</h3>

      <!-- Contact Details Section -->
      <div v-if="section.id === 'contact-details'" class="section-fields">
        <p>Please enter contact information. All fields in this section are required.</p>
        <v-text-field v-model.trim="draft.contactName" :label="requiredLabel('Contact Name(s)')" required
          v-bind="requiredFieldProps('contactName')"
          :error-messages="shouldShowFieldErrors('contactName') ? getFieldErrors('contactName') : []"
          hint="First and Last Name(s) for all relevant individuals, groups, or organizations"></v-text-field>
        <v-text-field v-model.trim="draft.contactEmails" :label="requiredLabel('Contact Email(s)')" required
          v-bind="requiredFieldProps('contactEmails')" :rules="[emailRule]"
          :error-messages="shouldShowFieldErrors('contactEmails') ? getFieldErrors('contactEmails') : []"
          hint="Email Address(es) for all relevant individuals, groups, or organizations"></v-text-field>
      </div>

      <!-- Contribution Type Details Sections -->
      <div v-if="section.id === 'tactic-details'" class="section-fields">
        <p>{{ detailSectionIntro('Please enter tactic information. All fields in this section are required.') }}</p>
        <v-text-field v-model.trim="draft.name" required :label="detailFieldLabel('Name')"
          v-bind="requiredFieldProps('name')"
          :error-messages="shouldShowFieldErrors('name') ? getFieldErrors('name') : []"
          :hint="detailNameHint"></v-text-field>
        <v-textarea v-model.trim="draft.description" :label="detailFieldLabel('Summary')" required
          v-bind="requiredFieldProps('description')"
          :error-messages="shouldShowFieldErrors('description') ? getFieldErrors('description') : []"
          :hint="detailDescriptionHint"></v-textarea>
      </div>

      <div v-if="section.id === 'technique-details'" class="section-fields">
        <p>{{ detailSectionIntro('Please enter technique information. All fields in this section are required.') }}</p>
        <v-text-field v-model.trim="draft.name" required :label="detailFieldLabel('Name')"
          v-bind="requiredFieldProps('name')"
          :error-messages="shouldShowFieldErrors('name') ? getFieldErrors('name') : []"
          :hint="detailNameHint"></v-text-field>
        <v-textarea v-model.trim="draft.description" :label="detailFieldLabel('Summary')" required
          v-bind="requiredFieldProps('description')"
          :error-messages="shouldShowFieldErrors('description') ? getFieldErrors('description') : []"
          :hint="detailDescriptionHint"></v-textarea>
      </div>

      <div v-if="section.id === 'mitigation-details'" class="section-fields">
        <p>{{ detailSectionIntro('Please enter mitigation information. All fields in this section are required.') }}</p>
        <v-text-field v-model.trim="draft.name" required :label="detailFieldLabel('Name')"
          v-bind="requiredFieldProps('name')"
          :error-messages="shouldShowFieldErrors('name') ? getFieldErrors('name') : []"
          :hint="detailNameHint"></v-text-field>
        <v-select v-model="draft.mitigationCategory" :label="requiredLabel('Mitigation Category')" required :items="categoryValues"
          v-bind="requiredFieldProps('mitigationCategory')"
          :error-messages="shouldShowFieldErrors('mitigationCategory') ? getFieldErrors('mitigationCategory') : []"
          hint="Select a mitigation category">
          <template #details>
            <div class="text-right flex-shrink-0 ms-4 me-n4">
              <router-link :to="{ name: 'Glossary', hash: '#mitigation-categories' }" target="_blank" class="text-info">
                View ATLAS Mitigation Categories
                <v-icon icon="mdi-open-in-new" size="small"></v-icon>
              </router-link>
            </div>
          </template>
        </v-select>
        <v-textarea v-model.trim="draft.description" :label="detailFieldLabel('Summary')" required
          v-bind="requiredFieldProps('description')"
          :error-messages="shouldShowFieldErrors('description') ? getFieldErrors('description') : []"
          :hint="detailDescriptionHint"></v-textarea>
        <v-select v-model="draft.mlLifecyclePhases" :items="mlLifecycleValues" required
          v-bind="requiredFieldProps('mlLifecyclePhases')"
          :error-messages="shouldShowFieldErrors('mlLifecyclePhases') ? getFieldErrors('mlLifecyclePhases') : []"
          :label="requiredLabel('Mitigation Lifecycle Phase(s)')" multiple clearable
          hint="Select all applicable ML Lifecycle phases">
          <template #details>
            <div class="text-right flex-shrink-0 ms-4 me-n4">
              <router-link :to="{ name: 'Glossary', hash: '#what-are-the-ml-lifecycle-stages' }" target="_blank" class="text-info">
                View ATLAS ML Lifecycle Stages
                <v-icon icon="mdi-open-in-new" size="small"></v-icon>
              </router-link>
            </div>
          </template>
        </v-select>
      </div>

      <div v-if="section.id === 'study-details'" class="section-fields">
        <p>{{ detailSectionIntro('Please enter case study information. All fields in this section except Case Study Month and Day are required.') }}</p>
        <v-text-field v-model.trim="draft.name" :label="detailFieldLabel('Name')" required
          v-bind="requiredFieldProps('name')"
          :error-messages="shouldShowFieldErrors('name') ? getFieldErrors('name') : []"
          :hint="detailNameHint" />
        <v-select v-model="draft.csType" :label="requiredLabel('Case Study Type')" required :items="csTypes"
          v-bind="requiredFieldProps('csType')"
          :error-messages="shouldShowFieldErrors('csType') ? getFieldErrors('csType') : []"
          hint="Select a case study type: an Exercise is an operation performed by a red team to identify vulnerabilities, while an Incident is a real-world event" />
        <v-text-field v-if="draft.csType === 'incident'" v-model.trim="draft.csReporter"
          :label="requiredLabel('Case Study Reporter')" required v-bind="requiredFieldProps('csReporter')"
          :error-messages="shouldShowFieldErrors('csReporter') ? getFieldErrors('csReporter') : []"
          hint="The individual or group that first reported the incident" />
        <v-text-field v-model.trim="draft.csActor" :label="requiredLabel('Case Study Actor')" required
          v-bind="requiredFieldProps('csActor')"
          :error-messages="shouldShowFieldErrors('csActor') ? getFieldErrors('csActor') : []"
          hint="The individual or group that performed this operation" />
        <v-text-field v-model.trim="draft.csTarget" :label="requiredLabel('Case Study Target')" required
          v-bind="requiredFieldProps('csTarget')"
          :error-messages="shouldShowFieldErrors('csTarget') ? getFieldErrors('csTarget') : []"
          hint="The victim or organization targeted by the Actor" />
        <div>
          <v-row class="mt-1">
            <v-col cols="12" sm="4">
              <v-select v-model="draft.csYear" :items="csYears"
                :label="requiredLabel('Case Study Year')" required v-bind="requiredFieldProps('csYear')"
                :error-messages="shouldShowFieldErrors('csYear') ? getFieldErrors('csYear') : []"
                hint="Year in which the exercise or incident occurred (required)" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select v-model="draft.csMonth" :items="csMonths" item-title="title" item-value="value"
                :label="requiredLabelIf('Case Study Month', draft.csDay)"
                :required="!isBlank(draft.csDay)"
                v-bind="requiredFieldProps('csMonth', !isBlank(draft.csDay))"
                :error-messages="shouldShowFieldErrors('csMonth') || !isBlank(draft.csDay) ? getFieldErrors('csMonth') : []"
                hint="Month (optional)" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field v-model.trim="draft.csDay" type="number" min="1" max="31"
                label="Case Study Day"
                :error-messages="shouldShowFieldErrors('csDay') ? getFieldErrors('csDay') : []"
                hint="Day (optional)" />
            </v-col>
          </v-row>
        </div>
        <v-textarea v-model.trim="draft.description" :label="detailFieldLabel('Summary')" required
          v-bind="requiredFieldProps('description')"
          :error-messages="shouldShowFieldErrors('description') ? getFieldErrors('description') : []"
          :hint="detailDescriptionHint" />
      </div>

      <div v-if="section.id === 'procedure'" class="section-fields">
        <p>
          Please enter at least one procedure step for the case study. All fields for the procedure step are required.
        </p>
        <p><b>To add more than one procedure step, click the “+” button.</b></p>
        <EditableProcedureTimeline v-if="displayProcedures.length > 0" v-model="displayProcedures"
          @delete-procedure="handleProcedureDelete" @update-procedure="handleProcedureUpdate" />
        <AddProcedure :key="procedureDraftKey" ref="procedureForm" v-model="procedureDraft"
          @submitProcedureStep="startNextProcedureStep" :show-validation="showProcedureDraftValidation" />
      </div>

      <!-- Associated Type Sections -->
      <div v-if="section.associatedType" class="section-fields">
        <p v-if="isEditAction">
          To suggest a <b>new association of an existing ATLAS
          {{ contributionTypeWordFromKey(section.associatedType, true) }}</b> for the selected
          {{ contributionTypeWordFromKey(type, true) }}, please select an existing
          {{ contributionTypeWordFromKey(section.associatedType, true) }}(s) from the options below.
        </p>
        <p v-if="isEditAction">
          To suggest a <b>brand new associated {{ contributionTypeWordFromKey(section.associatedType, true) }}</b>
          for the selected {{ contributionTypeWordFromKey(type, true) }}, click “Add New
          {{ contributionTypeWordFromKey(section.associatedType) }}” in the dropdown menu and enter the required
          information.
        </p>
        <p v-else>
          Please indicate any existing ATLAS {{ contributionTypeWordFromKey(section.associatedType, true, true) }}
          that may be associated with this {{ contributionTypeWordFromKey(type, true) }}. To suggest a new associated
          {{ contributionTypeWordFromKey(section.associatedType, true) }}, click “Add New
          {{ contributionTypeWordFromKey(section.associatedType) }}” in the dropdown menu.
        </p>
        <AssociatedTypeSelector :type="section.associatedType" :parent-type="props.type"
          :label="associationLabel(section.associatedType)"
          :hint="associationHint(section.associatedType)"
          v-model="draft[section.associatedType]" :show-validation="showValidation"
          :new-item-errors="getAssociatedDraftItemErrors(section.associatedType)" />
        <div v-if="associatedTechniqueUseItems.length" class="mt-4">
          <div v-for="technique in associatedTechniqueUseItems" :key="technique.id" class="mb-5">
            <div class="text-subtitle-2 mb-1">{{ technique.label }}</div>
            <v-text-field v-model.trim="draft.techniqueUses[technique.id]"
              :label="requiredLabel('Associated Technique Use')" required
              v-bind="requiredTechniqueUseProps(technique.id)"
              :hint="`How this mitigation applies to ${technique.label}`" />
          </div>
        </div>
        <template v-if="props.action === 'edit'">
          <p>
            Alternatively, if existing {{ contributionTypeWordFromKey(section.associatedType, true, true) }}
            <b>should not</b> be associated with the selected {{ contributionTypeWordFromKey(type, true) }},
            please select the existing ATLAS {{ contributionTypeWordFromKey(section.associatedType, true) }}
            associations for suggested removal.
          </p>
          <AssociatedTypeSelector :type="section.associatedType" :parent-type="props.type"
            v-model="draft.associationRemovals[section.associatedType]"
            :items="getAssociationRemovalItems(section.associatedType)"
            :label="associationRemovalLabel(section.associatedType)"
            :hint="associationRemovalHint(section.associatedType)"
            :allow-new="false" :show-validation="showValidation" />
        </template>
      </div>

      <!-- References Section -->
      <div v-if="section.id === 'references'" class="section-fields">
        <p>Please add any references relevant to the {{ contributionTypeWordFromKey(type, true) }}, such as articles, sources, etc. All
          fields in this section are optional.</p>
        <p><b>To add more than one reference, click the “+” button.</b></p>
        <AddReferences :type="type" v-model="draft.references" />
      </div>

      <!-- Save & Send Section -->
      <div v-if="section.id === 'save-send'">
        <p v-if="props.action === 'edit'">Before sending your suggested edits, briefly explain why each change is needed. Your rationale helps the MITRE ATLAS™ team evaluate the edits and make approval decisions.</p>
        <p v-else>Please feel free to add any additional comments or details about your contribution.</p>
        <v-textarea v-model.trim="draft.additionalInfo" :label="additionalInfoLabel"
          :required="isEditAction" v-bind="additionalInfoFieldProps"
          :error-messages="additionalInfoErrorMessages"
          :hint="additionalInfoHint"
          class="mt-4 mb-8"></v-textarea>

        <!-- Contribution List Section -->
        <h3 class="mb-3">Contribution List</h3>
        <p>Please review the following elements of your contribution for accuracy:</p>
        <div class="contribution-list" aria-label="Contribution summary">
          <div v-for="block in contributionSummaryBlocks" :key="block.id" class="contribution-list-block">
            <div v-if="block.title" class="contribution-list-title">{{ block.title }}</div>
            <div v-if="block.body" class="contribution-list-body">{{ block.body }}</div>
          </div>
        </div>

        <!-- File Creation Section -->
        <p class="mt-3">Please create and save a .yaml file of your contribution.</p>
        <v-text-field v-model.trim="draft.fileName" label="File Name" @update:model-value="handleFileNameInput"></v-text-field>
        <VAtlasBtnSecondary class="mb-2" @click="createContributionFile">Create File</VAtlasBtnSecondary>
        <v-alert v-if="props.type !== 'other' && showEndOfFormValidationError" type="error" density="compact" class="mb-4">
          {{ formValidationErrorMessage }}
        </v-alert>

      </div>

      <!-- General Contribution section, significantly different from the other types, uses no other sections -->
      <div v-if="section.id === 'other'" class="section-fields">
        <v-textarea v-model.trim="draft.description" :label="requiredLabel('Contribution Description')" required
          v-bind="requiredFieldProps('description')"
          :error-messages="shouldShowFieldErrors('description') ? getFieldErrors('description') : []"
          hint="Enter any general thoughts, concerns, or information you would like to contribute" />
        <p class="pt-8">If you would like to receive follow-up from the MITRE ATLAS™ team, please enter your contact
          information.</p>
        <v-text-field v-model.trim="draft.contactName" :label="requiredLabelIf('Contact Name(s)', draft.contactEmails)"
          :required="!!draft.contactEmails" v-bind="requiredFieldProps('contactName', !isBlank(draft.contactEmails))"
          :error-messages="shouldShowFieldErrors('contactName') ? getFieldErrors('contactName') : []"
          hint="First and Last Name(s) for all relevant individuals, groups, or organizations"></v-text-field>
        <v-text-field v-model.trim="draft.contactEmails" :label="requiredLabelIf('Contact Email(s)', draft.contactName)"
          :required="!!draft.contactName" v-bind="requiredFieldProps('contactEmails', !isBlank(draft.contactName))"
          :rules="[emailRule]"
          :error-messages="shouldShowFieldErrors('contactEmails') ? getFieldErrors('contactEmails') : []"
          hint="Email Address(es) for all relevant individuals, groups, or organizations"></v-text-field>
      </div>
    </div>

    <div v-if="!showThanks" class="submission-actions">
      <p v-if="props.type === 'other'" class="my-16">Please click “Send Your Contribution” to email your contribution to the 
        <a href='mailto:atlas@mitre.org' title="atlas@mitre.org">MITRE ATLAS™ team</a>.
      </p>
      <p v-else class="mt-2 mb-10">
        Once your file is saved, please click “Send Your Contribution” to email your file to the 
        <a href='mailto:atlas@mitre.org' title="atlas@mitre.org">MITRE ATLAS™ team</a>.
        <b>Please include your file as an attachment in the email.</b>
      </p>
      <div class="text-right">
        <VAtlasBtnSecondary size="large" class="mr-6" @click="showCancelDialog = true">Cancel</VAtlasBtnSecondary>
        <VAtlasBtnPrimary size="large"
          :disabled="!canSendCurrentDraft"
          @click="sendContribution">Send Your Contribution</VAtlasBtnPrimary>
      </div>
    </div>
    </v-form>

    <v-dialog
      v-model="showCancelDialog"
      max-width="520"
    >
      <v-card class="pa-6 text-mediumNavy">
        <div class="d-flex justify-end mb-2">
          <v-btn
            aria-label="Return to form"
            color="mediumNavy"
            density="comfortable"
            icon="mdi-close"
            variant="text"
            @click="showCancelDialog = false"
          />
        </div>
        <v-card-text class="text-center text-body-1 pa-0 mb-8">
          <p class="mb-6">Are you sure you want to cancel?</p>
          <p class="mb-0">Cancelling will clear all data from the form.</p>
        </v-card-text>
        <v-card-actions class="justify-center flex-wrap ga-8 pa-0">
          <VAtlasBtnSecondary size="large" width="195" @click="showCancelDialog = false">
            Return to Form
          </VAtlasBtnSecondary>
          <VAtlasBtnPrimary size="large" width="195" @click="confirmCancelContribution">
            Cancel
          </VAtlasBtnPrimary>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Thank You Message -->
    <div class="text-center mt-12" v-if="showThanks">
      <h2 class="mb-12 text-info">Thank you for your contribution!</h2>
      <p class="mt-9">You will receive a confirmation email shortly confirming receipt of your contribution.</p>
      <p class="mt-9">Need to resend your contribution? <a :href="contributionMailtoHref()">Send your contribution again</a></p>
      <p class="mt-9">The MITRE ATLAS™ team will review your submission and reach out with any additional follow-on actions.</p>
      <p class="mt-9">If you have any questions, please contact <a href='mailto:atlas@mitre.org'>atlas@mitre.org</a>.</p>
    </div>
  </v-defaults-provider>
</template>

<script setup>
import { useMain } from "@/stores/main"
import { computed, nextTick, ref, watch } from 'vue';
import AssociatedTypeSelector from "./AssociatedTypeSelector.vue";
import AddReferences from "./AddReferences.vue";
import { storeToRefs } from "pinia";
import AddProcedure from "../case-study-form/AddProcedure.vue";
import EditableProcedureTimeline from "../case-study-form/EditableProcedureTimeline.vue";
import { truncateText, validateUrl } from "@/assets/tools";
import {
  contributionObjectTypeFromKey,
  contributionTypeWordFromKey,
  downloadContributionFile,
  mapContributionToDraft,
  mapDraftToContribution,
  validateContributionDraftDetailed,
} from "@/assets/contributionTools.js";

const main = useMain();

const props = defineProps({
  action: { type: String, required: true }, // "add" | "edit"
  type: { type: String, required: true },
  sections: { type: Object, required: true },
  editTarget: { type: Object, required: false, default: null },
});

const showThanks = ref(false)
const showValidation = ref(false)
const formValidationErrorMessage = 'It looks like your file might be missing some required information. Before sending your file, please take a moment to review and ensure all required fields have been entered.'
const touchedRequiredFields = ref(new Set())
const formRef = ref(null)
const isVuetifyFormValid = ref(null)
const fileNameTouched = ref(false)
const hasDownloadedSinceLastChange = ref(false)
const showCancelDialog = ref(false)
const contributionEmailAddress = 'atlas@mitre.org'
const contributionFieldDefaults = { baseColor: 'lightNavy', color: 'lightNavy' }
const contributionDropdownFieldDefaults = {
  ...contributionFieldDefaults,
  menuProps: { stickToTarget: true, zIndex: 999 },
}
const formFieldDefaults = {
  global: { variant: 'outlined', persistentHint: true },
  VTextField: contributionFieldDefaults,
  VTextarea: contributionFieldDefaults,
  VSelect: contributionDropdownFieldDefaults,
  VAutocomplete: contributionDropdownFieldDefaults,
  // disable animation primary for the hint text
  VMessages: { transition: false },
}

const typeWord = computed(() => contributionTypeWordFromKey(props.type));
const typeWordLower = computed(() => contributionTypeWordFromKey(props.type, true));
const isEditAction = computed(() => props.action === 'edit')
const detailNameHint = computed(() => isEditAction.value ? `Revised ${typeWordLower.value} name` : undefined)
const detailDescriptionHint = computed(() =>
  isEditAction.value
    ? `Revised description of the ${typeWordLower.value}`
    : `Description of the ${typeWordLower.value}`
)
const additionalInfoLabel = computed(() =>
  isEditAction.value ? requiredLabel('Reason(s) for Suggested Edits') : 'Additional Info'
)
const additionalInfoHint = computed(() =>
  isEditAction.value ? 'Reason(s) to support the suggested edits' : '(Optional)'
)
const additionalInfoFieldProps = computed(() => {
  if (!isEditAction.value) return {}

  return requiredFieldProps('additionalInfo')
})
const additionalInfoErrorMessages = computed(() => {
  if (!isEditAction.value) return []
  if (!showValidation.value && !touchedRequiredFields.value.has('additionalInfo')) return []

  return getFieldErrors('additionalInfo')
})
const { categoryValues, mlLifecycleValues } = storeToRefs(main);

// --- draft model ---
function emptyTechnique() {
  return {
    id: "",
    "object-type": "technique",
    contactName: "",
    contactEmails: "",
    name: "",
    mitigationCategory: null,
    mlLifecyclePhases: [],
    description: "",
    tactics: [],
    mitigations: [],
    techniques: [],
    techniqueUses: {},
    associationRemovals: {},
    references: [],
    additionalInfo: "",
    fileName: "",
    maturity: undefined,
    // Case Study specific properties
    csType: null,
    csActor: "",
    csTarget: "",
    csReporter: "",
    csYear: null,
    csMonth: null,
    csDay: null,
    csProcedures: []

  }
}

function createEmptyDraft(typeKey) {
  const draft = emptyTechnique()
  draft['object-type'] = contributionObjectTypeFromKey(typeKey) || 'technique'
  return draft
}

function createEmptyProcedureStep() {
  return {
    tactic: '',
    technique: '',
    description: '',
  }
}

function resetFormState() {
  resetProcedureDraft()
  showThanks.value = false
  showValidation.value = false
  showCancelDialog.value = false
  touchedRequiredFields.value = new Set()
  formRef.value?.resetValidation?.()
}

function filenameWithoutYamlExtension(filename = '') {
  return String(filename).replace(/\.ya?ml$/i, '')
}

function sanitizeFilenameSegment(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function buildDefaultFileName(name = '', typeKey = props.type) {
  if (isEditAction.value) {
    return `${name || 'Contribution'} ${contributionTypeWordFromKey(typeKey)} Edit Suggestion`
  }

  const sanitizedName = sanitizeFilenameSegment(name) || 'contribution'
  const sanitizedType = sanitizeFilenameSegment(contributionTypeWordFromKey(typeKey)) || 'contribution'
  return `${sanitizedName}-${sanitizedType}.yaml`
}

const defaultFileName = computed(() => buildDefaultFileName(draft.value.name, props.type))

function handleFileNameInput(value) {
  fileNameTouched.value = filenameWithoutYamlExtension(value || '') !== filenameWithoutYamlExtension(defaultFileName.value)
}

const csTypes = [{ title: 'Exercise', value: 'exercise' }, { title: 'Incident', value: 'incident' }]

// Populate the prompting arrays for month and year
const csYears = Array.from({ length: 31 }, (_, i) => new Date().getFullYear() - i);
const csMonths = [{ title: 'January', value: 1 }, { title: 'February', value: 2 }, { title: 'March', value: 3 }, { title: 'April', value: 4 }, { title: 'May', value: 5 }, { title: 'June', value: 6 }, { title: 'July', value: 7 }, { title: 'August', value: 8 }, { title: 'September', value: 9 }, { title: 'October', value: 10 }, { title: 'November', value: 11 }, { title: 'December', value: 12 }]

const draft = ref(createEmptyDraft(props.type))
const mainFormBaseline = ref(contributionDraftSnapshot(draft.value))
const associationRemovalItems = ref({})
const procedureDraft = ref(createEmptyProcedureStep())
const procedureDraftKey = ref(0)

function contributionDraftSnapshot(sourceDraft) {
  const copy = { ...sourceDraft }
  delete copy.fileName
  delete copy['object-type']
  return JSON.stringify(copy)
}

function resetMainFormBaseline() {
  mainFormBaseline.value = contributionDraftSnapshot(draft.value)
}

function resetDraftForType() {
  draft.value = createEmptyDraft(props.type)
  draft.value.fileName = defaultFileName.value
  associationRemovalItems.value = {}
  resetFormState()
  resetMainFormBaseline()
  fileNameTouched.value = false
  hasDownloadedSinceLastChange.value = false
}

function associationValueId(value) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && typeof value.id === 'string') return value.id
  return null
}

function detailSectionIntro(defaultCopy) {
  if (isEditAction.value) {
    return `The fields below have been pre-populated with details of the selected ${typeWordLower.value}. Please update any fields you would like to suggest an edit for and leave any fields without suggested edits unchanged.`
  }

  return defaultCopy
}

function detailFieldLabel(fieldName) {
  const prefix = isEditAction.value ? 'Suggested ' : ''
  return requiredLabel(`${prefix}${typeWord.value} ${fieldName}`)
}

function associationRemovalLabel(typeKey) {
  return `Suggested ATLAS ${contributionTypeWordFromKey(typeKey)}(s) for Association Removal`
}

function associationRemovalHint(typeKey) {
  return `Select all ATLAS ${contributionTypeWordFromKey(typeKey, true, true)} suggested for association removal`
}

function associationLabel(typeKey) {
  if (!isEditAction.value) return ''

  return `Suggested ATLAS ${contributionTypeWordFromKey(typeKey)}(s) for Association`
}

function associationHint(typeKey) {
  if (!isEditAction.value) return ''

  return `Select all ATLAS ${contributionTypeWordFromKey(typeKey, true, true)} suggested for new association`
}

function getAssociationRemovalItems(typeKey) {
  return associationRemovalItems.value[typeKey] ?? []
}

const associatedTechniqueUseItems = computed(() => {
  if (props.type !== 'mitigations') return []

  const techniques = Array.isArray(draft.value.techniques) ? draft.value.techniques : []
  return techniques
    .filter((technique) => !isDraftItem(technique))
    .map((technique) => {
      const id = associationValueId(technique)
      if (!id) return null

      const dataObject = main.getDataObjectById(id)
      return {
        id,
        label: dataObject?.label || dataObject?.name || id,
      }
    })
    .filter(Boolean)
})

function techniqueUseField(id) {
  return `techniqueUses.${id}`
}

function requiredTechniqueUseProps(id) {
  const field = techniqueUseField(id)

  return {
    error: isBlank(draft.value.techniqueUses?.[id]) &&
      (showValidation.value || touchedRequiredFields.value.has(field)),
    'onUpdate:focused': (focused) => {
      if (!focused) markRequiredFieldTouched(field)
    }
  }
}

function setAssociationRemovalItemsFromDraft(sourceDraft) {
  const removalItems = {}
  const associatedSections = props.sections[props.type]?.filter((section) => section.associatedType) ?? []

  for (const section of associatedSections) {
    const ids = (sourceDraft[section.associatedType] ?? [])
      .map(associationValueId)
      .filter(Boolean)

    removalItems[section.associatedType] = ids.map((id) =>
      main.getDataObjectById(id) ?? { id, name: id }
    )
  }

  associationRemovalItems.value = removalItems
}

async function loadEditTargetDraft(target) {
  const targetDraft = mapContributionToDraft(target)
  draft.value = {
    ...createEmptyDraft(props.type),
    ...targetDraft,
    associationRemovals: targetDraft.associationRemovals ?? {},
  }
  setAssociationRemovalItemsFromDraft(targetDraft)

  resetFormState()
  fileNameTouched.value = false
  if (!draft.value.fileName) {
    draft.value.fileName = defaultFileName.value
  }
  resetMainFormBaseline()
  hasDownloadedSinceLastChange.value = false
  await nextTick()
}

watch(() => props.type, () => {
  resetDraftForType()
})

watch(() => props.editTarget, async (target) => {
  if (props.action !== 'edit') return

  if (!target) {
    resetDraftForType()
    return
  }

  await loadEditTargetDraft(target)
}, { immediate: true })

watch(() => draft.value.name, () => {
  if (!fileNameTouched.value) {
    draft.value.fileName = defaultFileName.value
  }
}, { immediate: true })

watch(draft, () => {
  if (props.type !== 'other') {
    hasDownloadedSinceLastChange.value = false
  }
}, { deep: true })

watch(procedureDraft, syncProcedureDraft, { deep: true })

const displayProcedures = computed({
  get() {
    return draft.value.csProcedures.filter((procedure) => procedure !== procedureDraft.value)
  },
  set(procedures) {
    if (draft.value.csProcedures.includes(procedureDraft.value)) {
      draft.value.csProcedures = [...procedures, procedureDraft.value]
      return
    }

    draft.value.csProcedures = procedures
  }
})

const showProcedureDraftValidation = computed(() => {
  if (!showValidation.value) return false
  return displayProcedures.value.length === 0 || hasProcedureContent(procedureDraft.value)
})

async function startNextProcedureStep(newProcedureStep) {
  const draftIndex = draft.value.csProcedures.indexOf(procedureDraft.value)
  if (draftIndex === -1) {
    draft.value.csProcedures.push(newProcedureStep)
  } else {
    draft.value.csProcedures[draftIndex] = newProcedureStep
  }
  resetProcedureDraft()
  await scrollToSectionAfterProcedureLayoutChange()
}

function resetProcedureDraft() {
  procedureDraft.value = createEmptyProcedureStep()
  procedureDraftKey.value += 1
}

function hasProcedureContent(procedure) {
  return Boolean(
    procedure?.tactic ||
    procedure?.technique ||
    procedure?.description?.trim()
  )
}

function syncProcedureDraft(procedure) {
  const draftIndex = draft.value.csProcedures.indexOf(procedure)

  if (hasProcedureContent(procedure)) {
    if (draftIndex === -1) draft.value.csProcedures.push(procedure)
    return
  }

  if (draftIndex !== -1) draft.value.csProcedures.splice(draftIndex, 1)
}

function handleProcedureDelete(deletedProcedure) {
  const deleteIndex = draft.value.csProcedures.indexOf(deletedProcedure)
  if (deleteIndex !== -1) draft.value.csProcedures.splice(deleteIndex, 1)
}

function handleProcedureUpdate(updatedProcedure, index, originalProcedure) {
  const updateIndex = draft.value.csProcedures.indexOf(originalProcedure)
  if (updateIndex !== -1) draft.value.csProcedures[updateIndex] = updatedProcedure
}

async function scrollToSectionAfterProcedureLayoutChange() {
  await nextTick()
  requestAnimationFrame(() => {
    document.getElementById('procedure')?.scrollIntoView({ block: 'start' })
  })
}

const contributionSummaryBlocks = computed(() => {
  const relevantSections = props.sections[props.type] ?? [];
  const d = draft.value; // keep this inside computed

  const blocks = []

  for (const section of relevantSections) {
    if (section.transformer) {
      const result = section.transformer(section, d, typeWord.value);
      if (result && (result.title || result.body)) {
        blocks.push({
          id: section.id,
          title: result.title,
          body: result.body,
        })
      }
    }

    if (section.removalTransformer) {
      const result = section.removalTransformer(section, d, typeWord.value);
      if (result && (result.title || result.body)) {
        blocks.push({
          id: `${section.id}-removals`,
          title: result.title,
          body: result.body,
        })
      }
    }
  }

  const additionalInfo = truncateText(d.additionalInfo, 180)
  if (additionalInfo) {
    blocks.push({
      id: 'additional-info',
      title: isEditAction.value ? 'Reason(s) for Suggested Edits:' : 'Additional Info:',
      body: additionalInfo,
    })
  }

  return blocks
});

const hasDraftValidationErrors = computed(() => {
  const hasFieldErrors = Object.values(validationState.value.fieldErrors).some((messages) => messages.length > 0)
  const hasSummaryErrors = validationState.value.summaryErrors.length > 0
  return hasFieldErrors || hasSummaryErrors
})

const isCurrentDraftValid = computed(() =>
  isVuetifyFormValid.value !== false && !hasDraftValidationErrors.value
)

const canSendCurrentDraft = computed(() =>
  isCurrentDraftValid.value && (props.type === 'other' || hasDownloadedSinceLastChange.value)
)

function contributionEmailSubject() {
  if (props.type === 'other') return 'New ATLAS Contribution: General Contribution'
  return `New ATLAS Contribution: ${emailYamlFilename()}`
}

function contributionEmailBody() {
  if (props.type === 'other') {
    return `Contribution Description:
${draft.value.description.trim()}

Contact Name(s):
${draft.value.contactName.trim()}

Contact Email(s):
${draft.value.contactEmails.trim()}`
  }

  return `Hello!

Please find attached a new ${contributionTypeWordFromKey(props.type, true)}, ${emailYamlFilename()}, I’d like to submit to the MITRE ATLAS™ team for consideration.

[Please feel free to add an optional brief note or description of your contribution.]

Regards,

[Your Name]
[Your Role / Organization]`
}

function contributionMailtoHref() {
  return `mailto:${contributionEmailAddress}?` +
    `subject=${mailtoEncode(contributionEmailSubject())}&` +
    `body=${mailtoEncode(contributionEmailBody())}`
}

function mailtoEncode(value) {
  // URLSearchParams() uses +s as spaces, which Outlook doesn't strip, so escape manually
  return encodeURIComponent(String(value).replace(/\r?\n/g, '\r\n'))
}

function emailYamlFilename() {
  const filename = filenameWithoutYamlExtension((draft.value.fileName || draft.value.name || 'contribution').trim())
  return `${filename || 'contribution'}.yaml`
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function pushError(target, field, message) {
  if (!target[field]) target[field] = []
  if (!target[field].includes(message)) target[field].push(message)
}

function isBlank(value) {
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return value === null || value === undefined || value === ''
}

function requiredLabel(label) {
  return `${label} *`
}

function requiredLabelIf(label, value) {
  return isBlank(value) ? label : requiredLabel(label)
}

function markRequiredFieldTouched(field) {
  if (touchedRequiredFields.value.has(field)) return
  touchedRequiredFields.value = new Set(touchedRequiredFields.value).add(field)
}

function requiredFieldProps(field, required = true) {
  const isRequired = isFieldRequired(field, required)

  return {
    error: isRequired && isBlank(draft.value[field]) &&
      (showValidation.value || touchedRequiredFields.value.has(field)),
    'onUpdate:focused': (focused) => {
      if (!focused) markRequiredFieldTouched(field)
    }
  }
}

function isFieldRequired(field, required = true) {
  return Boolean(required)
}

function isDraftContentValue(field, value) {
  if (field === 'object-type' || field === 'fileName') return false
  if (field === 'associationRemovals') {
    return Object.values(value ?? {}).some((items) => Array.isArray(items) && items.length > 0)
  }
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') return Object.keys(value).length > 0
  return !isBlank(value)
}

const hasDraftContent = computed(() =>
  Object.entries(draft.value).some(([field, value]) => isDraftContentValue(field, value))
)

const hasUserModifiedMainForm = computed(() =>
  contributionDraftSnapshot(draft.value) !== mainFormBaseline.value
)

const showEndOfFormValidationError = computed(() =>
  !showThanks.value && hasUserModifiedMainForm.value && !isCurrentDraftValid.value
)

function emailRule(value) {
  if (isBlank(value)) return true
  return EMAIL_REGEX.test(String(value).trim()) || 'Enter a valid email address.'
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

const validationState = computed(() => {
  const fieldErrors = {}
  const summaryErrors = []

  addRequiredFieldErrors(fieldErrors)
  addAssociatedDraftItemErrors(fieldErrors)
  addMitigationTechniqueUseErrors(fieldErrors)
  addProcedureStepErrors(fieldErrors)

  if (props.type === 'studies') {
    const year = Number(draft.value.csYear)
    const month = Number(draft.value.csMonth)
    const day = Number(draft.value.csDay)

    addRequiredFieldError(
      fieldErrors,
      'csMonth',
      'Case study month',
      !isBlank(draft.value.csDay),
      'Select a month when providing a day.'
    )

    if (!isBlank(draft.value.csDay)) {
      if (!Number.isInteger(day) || day < 1 || day > 31) {
        pushError(fieldErrors, 'csDay', 'Day must be a number between 1 and 31.')
        return
      }

      if (!isBlank(draft.value.csYear) && !isBlank(draft.value.csMonth) && day > daysInMonth(year, month)) {
        pushError(fieldErrors, 'csDay', 'Day must be valid for the selected month and year.')
      }
    }


  }

  try {
    const detail = validateContributionDraftDetailed(draft.value, props.type)
    for (const error of detail.errors) {
      if (error.field) {
        if (!fieldErrors[error.field]?.length) pushError(fieldErrors, error.field, error.message)
      } else if (!summaryErrors.includes(error.message)) {
        summaryErrors.push(error.message)
      }
    }
  } catch (error) {
    const reason = error instanceof Error && error.message
      ? error.message
      : 'an unexpected validation error occurred'
    summaryErrors.push(`Validation failed while preparing your contribution for schema checks: ${reason}.`)
  }

  return { fieldErrors, summaryErrors }
})

function addRequiredFieldErrors(fieldErrors) {
  if (props.type === 'other') {
    addRequiredFieldError(fieldErrors, 'description', 'Contribution description')
    // For General Contributions, contact name and contact email are mutually required.
    addRequiredFieldError(fieldErrors, 'contactName', 'Contact name', !isBlank(draft.value.contactEmails))
    addRequiredFieldError(fieldErrors, 'contactEmails', 'Contact email', !isBlank(draft.value.contactName))
    return
  }

  addRequiredFieldError(fieldErrors, 'contactName', 'Contact name')
  addRequiredFieldError(fieldErrors, 'contactEmails', 'Contact email')

  if (isEditAction.value) {
    addRequiredFieldError(
      fieldErrors,
      'additionalInfo',
      'Reason(s) for suggested edits',
      true,
      'Reason(s) to support the suggested edits'
    )
  }

  const requiredFieldsByType = {
    tactics: [],
    techniques: [],
    mitigations: [
      ['mitigationCategory', 'Mitigation category'],
      ['mlLifecyclePhases', 'At least one mitigation lifecycle phase']
    ],
    studies: [
      ['csType', 'Case study type'],
      ['csActor', 'Case study actor'],
      ['csTarget', 'Case study target'],
      ['csReporter', 'Case study reporter', draft.value.csType === 'incident'],
      ['csProcedures', 'At least one procedure step']
    ]
  }

  for (const [field, label, shouldRequire = true] of requiredFieldsByType[props.type] || []) {
    addRequiredFieldError(fieldErrors, field, label, shouldRequire)
  }
}

function addProcedureStepErrors(fieldErrors) {
  if (props.type !== 'studies') return

  const procedures = Array.isArray(draft.value.csProcedures) ? draft.value.csProcedures : []
  if (!procedures.length) return

  const requiredProcedureFields = [
    ['tactic', 'tactic'],
    ['technique', 'technique'],
    ['description', 'summary'],
  ]

  for (const [field, label] of requiredProcedureFields) {
    if (procedures.some((procedure) => isBlank(procedure?.[field]))) {
      pushError(fieldErrors, 'csProcedures', `Procedure step ${label} is required.`)
    }
  }
}

function addRequiredFieldError(
  fieldErrors,
  field,
  label,
  shouldRequire = true,
  message = ''
) {
  if (shouldRequire && isBlank(draft.value[field])) {
    pushError(fieldErrors, field, message || `${label} is required.`)
  }
}

function isDraftItem(value) {
  return value && typeof value === 'object' && value.id === 'new'
}

function shouldRequireAssociatedTechniqueUse(associatedType) {
  return props.type === 'mitigations' && associatedType === 'techniques'
}

function addMitigationTechniqueUseErrors(fieldErrors) {
  if (props.type !== 'mitigations') return

  const techniques = Array.isArray(draft.value.techniques) ? draft.value.techniques : []

  for (const technique of techniques) {
    if (isDraftItem(technique)) {
      continue
    }

    const id = associationValueId(technique)
    if (id && isBlank(draft.value.techniqueUses?.[id])) {
      pushError(fieldErrors, techniqueUseField(id), 'Associated technique use is required.')
    }
  }
}

function addAssociatedDraftItemErrors(fieldErrors) {
  const associatedSections = props.sections[props.type]?.filter((section) => section.associatedType) ?? []

  for (const section of associatedSections) {
    const associatedType = section.associatedType
    const items = Array.isArray(draft.value[associatedType]) ? draft.value[associatedType] : []
    const draftItems = items.filter(isDraftItem)
    if (!draftItems.length) continue

    const typeWord = contributionTypeWordFromKey(associatedType, true)
    if (draftItems.some((item) => isBlank(item.name))) {
      pushError(
        fieldErrors,
        associatedDraftItemField(associatedType, 'name'),
        `New associated ${typeWord} name is required.`
      )
    }
    if (draftItems.some((item) => isBlank(item.summary))) {
      pushError(
        fieldErrors,
        associatedDraftItemField(associatedType, 'summary'),
        `New associated ${typeWord} summary is required.`
      )
    }
    if (shouldRequireAssociatedTechniqueUse(associatedType) && draftItems.some((item) => isBlank(item.use))) {
      pushError(
        fieldErrors,
        associatedDraftItemField(associatedType, 'use'),
        'Associated technique use is required.'
      )
    }
    if (draftItems.some((item) => validateUrl(item.referenceLink) !== true)) {
      const referenceLinkError = draftItems
        .map((item) => validateUrl(item.referenceLink))
        .find((result) => result !== true)
      pushError(fieldErrors, associatedDraftItemField(associatedType, 'referenceLink'), referenceLinkError)
    }
  }
}

function associatedDraftItemField(associatedType, field) {
  return `${associatedType}.new.${field}`
}

function associatedDraftItem(associatedType) {
  const items = Array.isArray(draft.value[associatedType]) ? draft.value[associatedType] : []
  return items.find(isDraftItem) ?? null
}

function getAssociatedDraftItemErrors(associatedType) {
  const item = associatedDraftItem(associatedType)
  const errors = {}
  if (!item) return errors

  const fields = shouldRequireAssociatedTechniqueUse(associatedType)
    ? ['name', 'summary', 'use', 'referenceLink']
    : ['name', 'summary', 'referenceLink']

  for (const field of fields) {
    if (field === 'referenceLink' && !showValidation.value && isBlank(item.referenceLink)) continue

    const fieldErrors = validationState.value.fieldErrors[associatedDraftItemField(associatedType, field)] || []
    if (fieldErrors.length) errors[field] = fieldErrors
  }

  return errors
}

function getFieldErrors(field) {
  return (validationState.value.fieldErrors[field] || []).filter(
    (message) => !isRequiredValidationMessage(message)
  )
}

function isRequiredValidationMessage(message) {
  return /(^This field|^A .+|^At least one .+|.+) is required\.$/.test(message)
}

function shouldShowFieldErrors(field) {
  return showValidation.value || !isBlank(draft.value[field])
}

async function validateForm() {
  showValidation.value = true
  await nextTick()
  const formResult = await formRef.value?.validate?.()

  const hasVuetifyErrors = formResult?.valid === false

  return !(hasVuetifyErrors || hasDraftValidationErrors.value)
}

async function createContributionFile() {
  showValidation.value = true
  await nextTick()
  await formRef.value?.validate?.()

  const obj = mapDraftToContribution(draft.value, props.type);
  const name = filenameWithoutYamlExtension((draft.value.fileName || draft.value.name || '').trim());
  downloadContributionFile(obj, name);
  hasDownloadedSinceLastChange.value = true
}

async function sendContribution() {
  const isValid = await validateForm()
  if (!isValid) {
    return
  }

  showThanks.value = true
  window.location.href = contributionMailtoHref()
}

function confirmCancelContribution() {
  showCancelDialog.value = false
  resetDraftForType()
}

async function loadContributionDraft(contributionObj, filename = '') {
  const uploadedFileName = filenameWithoutYamlExtension(filename)
  const uploadedDraft = mapContributionToDraft(contributionObj)
  draft.value = {
    ...createEmptyDraft(props.type),
    ...uploadedDraft,
    fileName: uploadedFileName || uploadedDraft.fileName || uploadedDraft.name || '',
  }

  resetFormState()
  fileNameTouched.value = Boolean(uploadedFileName || uploadedDraft.fileName)
  if (!draft.value.fileName) {
    draft.value.fileName = defaultFileName.value
    fileNameTouched.value = false
  }
  resetMainFormBaseline()
  await nextTick()
  const isValid = await validateForm()
  hasDownloadedSinceLastChange.value = isValid
}

defineExpose({
  loadContributionDraft,
  isFormDirty: () => hasDraftContent.value,
})

</script>

<style scoped>
.section-fields>* {
  margin: 16px 0;
}

.section-container {
  margin-bottom: 50px;
}

.section-container.save-send-section {
  margin-bottom: 0;
}

.section-header {
  scroll-margin-top: 80px;
  border-bottom: 2px solid rgb(var(--v-theme-info));
  color: rgb(var(--v-theme-mediumNavy));
  margin-bottom: 16px;
}

a {
  color: rgb(var(--v-theme-info));
}

</style>
<style>
.contribution-list {
  background-color: #FCFCFC;
  border: 1px solid rgb(var(--v-theme-info));
  border-radius: 4px;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  min-height: 96px;
  padding: 14px 16px;
  white-space: pre-wrap;
}

.contribution-list-block + .contribution-list-block {
  margin-top: 16px;
}

.contribution-list-title {
  font-weight: 700;
}

.contribution-list-body {
  margin-top: 2px;
}
</style>
