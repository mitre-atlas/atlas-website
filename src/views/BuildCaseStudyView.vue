<template>
  <v-row class="align-start">
    <PageSectionTitle :pageTitle="title"/>
    <v-chip class="ml-2 mt-3">
      {{ `v${schema.$version}` }}
    </v-chip>
  </v-row>
  <p class="text-h6 mb-0 mt-6">
    Details
  </p>
  <p class="text-body-2 text-grey">
    All fields are required.
  </p>
  <v-form @submit.prevent v-model="isMainFormValid" ref="mainForm">
    <div v-for="field in fields" :key="field.name">
      <div v-if="field.name === 'Case Study Type'">
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-card
            v-bind="props"
            variant="outlined"
            class="mb-0"
            subtitle="Select case study type"
            height="120"
            :style="[
              isHovering && isStudyTypeValid
                ? { 'border-color': '#424242' }
                : { 'border-color': '#9E9E9E' },
              !isStudyTypeValid
                ? { 'border-color': '#b00020' }
                : {}
            ]"
          >
            <v-radio-group
              v-model="vModel.caseStudyType"
              :prepend-icon="field.icon"
              density="compact"
              class="pl-4 pt-3"
              :rules="[requiredRule]"
              :hide-details="true"
            >
              <v-row
                v-for="option in field.options"
                :key="option.name"
              >
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <div class="d-flex">
                      <v-radio
                        v-bind="props"
                        :label="option.name"
                        :value="option.name.toLowerCase()"
                      />
                      <div v-if="isHovering" class="ml-6 text-caption pt-1">
                        <v-icon>mdi-menu-right</v-icon>
                        {{ option.description }}
                      </div>
                    </div>
                  </template>
                </v-hover>
              </v-row>
            </v-radio-group>
          </v-card>
        </template>
      </v-hover>
        <div
          :style="{ 'visibility': !isStudyTypeValid ? 'visible' : 'hidden', 'color': '#c13951', }"
          class="ml-4 mt-1 mb-3 text-caption font-weight-medium"
        >
          Required
        </div>
      </div>

      <v-text-field
        v-if="textFields.includes(field.name.toLowerCase())"
        v-model="vModel[field.name.toLowerCase()]"
        variant="outlined"
        :label="field.name"
        :prepend-inner-icon="field.icon"
        :hint="field.description"
        :rules="field.name === 'Reporter' && vModel['caseStudyType'] !== 'incident' ? [] : [requiredRule]"
        :disabled="field.name === 'Reporter' && vModel['caseStudyType'] !== 'incident'"
        class="mb-3"
      />

      <v-textarea
        v-if="field.name === 'Summary'"
        v-model="vModel[field.name.toLowerCase()]"
        variant="outlined"
        :label="field.name"
        :prepend-inner-icon="field.icon"
        :hint="field.description"
        :rules="[requiredRule]"
      />


      <v-menu 
        v-if="field.name === 'Incident Date'"
        :close-on-content-click="false"
        v-model="isDateEntered"
      >
        <template v-slot:activator="{ props }">
          <v-text-field
            v-bind="props"
            v-model="formattedDate"
            variant="outlined"
            :label="field.name"
            :prepend-inner-icon="field.icon"
            :hint="field.description"
            class="mb-3"
            readonly
            :rules="[requiredRule]"
          />
        </template>
        <v-date-picker 
          v-model="date"
          @update:model-value="isDateEntered = false"
          :max="
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .substr(0, 10)
          "
        />
      </v-menu>
    </div>

    <p class="text-h6 mb-0 mt-6">
      Procedure
    </p>
    <p class="text-body-2 text-grey">
      Construct a timeline of the incident, mapped to MITRE ATLAS&trade; techniques.
      <span
        :style="vModel.procedure.length === 0 && formSubmitted ? 'color: #FF5252' : ''"
        >Add at least one step.
      </span>
    </p>

    <v-row class="my-3 mx-6">
      <EditableProcedureTimeline
        v-if="vModel.procedure.length > 0"
        :procedure="vModel.procedure"
        @delete="deleteProcedure"
      />
    </v-row>

    <AddProcedure
      ref="procedureForm"
      v-if="!showAddNewStep"
      @submitProcedureStep="addProcedureStep"
      @updateShowAddNewStep="showAddNewStep = true"
      :existingProcedures="vModel.procedure"
    />
    <div
      :style="{ 'visibility': vModel.procedure.length === 0 && formSubmitted && !showAddNewStep ? 'visible' : 'hidden', 'color': '#c13951', }"
      class="ml-4 mb-3 text-caption font-weight-medium"
    >
      At least one procedure step is required.
    </div>
    <v-btn
      v-if="showAddNewStep" 
      prepend-icon="mdi-plus"
      @click="showAddNewStep = false"
    >
      Add New Step
    </v-btn>

    <p class="text-h6 mb-0 mt-12">
      References
    </p>
    <p class="text-body-2 text-grey">
      Optionally list sources for this case study.
    </p>
    <v-btn
      prepend-icon="mdi-plus"
      @click="showAddNewStep = false"
    >
      Add New Source
    </v-btn>

    <p class="text-h6 mb-0 mt-12">
      Download
    </p>
    <p class="text-body-2 text-grey">
      Download the case study data file, specifying the filename here. Once
      downloaded, email the file to
      <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
    </p>

    <v-row>
      <v-col>
        <v-text-field
          :v-model="filename"
          variant="outlined"
          label="Case Study Filename"
          prepend-inner-icon="mdi-file-download"
          hint="Filename of the case study. The .yaml extension will be auto-applied."
          :rules="[requiredRule]"
          class="mb-3"
          clearable
        />
      </v-col>
      <v-checkbox
        label="Also download as PowerPoint"
        v-model="downloadPptCheckbox"
        class="ml-6"
      />
    </v-row>




    <v-row class="align-center">
      <v-btn
        type="submit"
        color="blue" 
        prepend-icon="mdi-download"
        @click="downloadCaseStudy"
      >
        Download Case Study
      </v-btn>
      <v-alert
        v-if="formSubmitted && (isMainFormValid === false || vModel.procedure.length === 0)"
        icon="mdi-alert" 
        color="red-lighten-4"
        density="compact"
        class="ml-6"
      >
        Please address any errors above.
      </v-alert>
    </v-row>
  </v-form>
</template>

<script setup>
  import { ref, watch, computed, reactive } from 'vue'
  import jsyaml from 'js-yaml'
  import { getPathWithBase } from '@/assets/tools.js'
  import AddProcedure from '../components/case-study-form/AddProcedure.vue'
  import EditableProcedureTimeline from '../components/case-study-form/EditableProcedureTimeline.vue'
  import schema from '/public/atlas-data/dist/schemas/atlas_website_case_study_schema.json'
  import { downloadStudyFile, setMetaData } from '@/assets/tools.js'
  import { makePPT } from '@/assets/powerpointFunctions.js'
  import { useMain } from "@/stores/main"
  import PageSectionTitle from "@//components/PageSectionTitle.vue"

  const title = 'Create a Case Study'

  const mainStore = useMain()

  const fields = ref([])

  getYaml()

  async function getYaml() {
    try {
        const response = await fetch(getPathWithBase('/content/case-study-legend.yaml'))
        const categories = await response.text()
        const data = jsyaml.load(categories).legend
        const fieldOrder = ['case_study_type', 'name', 'target', 'actor', 'reporter', 'incident_date', 'summary']

        fieldOrder.forEach((field) => {
          fields.value.push(data[field])
        })
    } catch (error) {
        console.error('Error fetching YAML file:', error)
    }
  }

  const isMainFormValid = ref()
  const vModel = reactive({procedure: []})
  const textFields = ['name', 'target', 'actor', 'reporter', 'incident_date']
  const filename = ref('')

  const isStudyTypeValid = computed(() => {
    if(vModel['caseStudyType']) return true
    if(vModel['caseStudyType'] === undefined && !formSubmitted.value) return true
    return false
  })

  const date = ref()
  const isDateEntered = ref(false)

  const formattedDate = computed(() => {
    if(date.value) {
      return date.value.toISOString().split('T')[0]
    }
    return ''
  })

  watch(formattedDate, (newVal) => {
    vModel['incident-date'] = new Date(date.value)
  })
  
  const formSubmitted = ref(false)

  function requiredRule(value) {
    if (typeof value === 'string' && value.trim()) return true
    return `Required`
  }

  function addProcedureStep(newStep) {
    vModel.procedure.push(newStep)
    showAddNewStep.value = true
  }

  function deleteProcedure(index) {
    vModel.procedure.splice(index, 1)
  }

  const showAddNewStep = ref(false)

  const procedureForm = ref(null)

  const downloadPptCheckbox = ref(false)

  const mainForm = ref(null)

  function downloadCaseStudy() {
    formSubmitted.value = true
    if(vModel.procedure.length === 0) {
      procedureForm.value.addProcedureStep()
    }
    if(isMainFormValid.value && vModel.procedure.length > 0) {
      let studyData = { study: vModel }

      if(vModel.caseStudyType === 'exercise' && vModel.reporter !== undefined) {
        delete studyData.study.reporter
      }

      studyData.meta = setMetaData(
        studyData,
        schema.$version
      )
      downloadStudyFile(studyData, filename.value)
      if(downloadPptCheckbox.value) {
        downloadPPT(vModel)
      }
      formSubmitted.value = false
    }
  }

  async function downloadPPT(study) {
    for (const procedure of study.procedure) {
      const technique = await mainStore.getDataObjectById(procedure.technique);
      procedure.techniqueObject = technique
    }
    makePPT(study)
    // delete techniqueObjects, which are only needed in makePPT
    study.procedure.forEach((procedure) => {
      delete procedure.techniqueObject
    })
  }


</script>