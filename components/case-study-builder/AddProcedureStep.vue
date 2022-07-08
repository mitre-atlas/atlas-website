<template>
  <div id="addForm">
    <v-card
      class="my-5"
      outlined
      :style="[shouldShowErrorBorder ? { 'border-color': '#FF5252', 'border-width': '2px' } : {}]"
    >
      <v-card-title :style="shouldShowErrorBorder ? 'color: #FF5252' : ''">
        Add Procedure Step
        <v-spacer />
      </v-card-title>
      <procedure-form
        :key="selectTacticData"
        :select-tactic-data="selectTacticData"
        :select-technique-data="selectTechniqueData"
        :description-data="descriptionData"
        @tacticUpdate="selectTacticData = $event"
        @techniqueUpdate="selectTechniqueData = $event"
        @descriptionUpdate="descriptionData = $event"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="grey" @click="$emit('addingBoolUpdate', false)">
          Cancel
        </v-btn>
        <v-btn text color="green" @click="addProcedureStep">
          Save
        </v-btn>
      </v-card-actions>

      <v-alert
        v-if="addStepErr"
        text
        color="red"
        type="error"
        dense
      >
        {{ addStepErr }}
      </v-alert>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AddProcedureStep',
  props: ['selectTactic', 'selectTechnique', 'description', 'addingStep', 'isError'],
  data () {
    return {
      selectTacticData: this.selectTactic,
      selectTechniqueData: this.selectTechnique,
      descriptionData: this.description,
      addStepErr: '',
      addingBool: this.addingStep,
      shouldShowErrorBorder: this.isError
    }
  },
  watch: {
    isError: {
      // Ensures that the component data is up to date with error update from createstudy
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.shouldShowErrorBorder = newVal
      }
    }
  },
  methods: {
    addProcedureStep () {
      if (this.selectTacticData && this.selectTechniqueData && this.descriptionData) {
        const newStep = {
          tactic: this.selectTacticData,
          technique: this.selectTechniqueData,
          description: this.descriptionData
        }
        this.$emit('clicked', newStep)
        this.clearStepInput()
      } else {
        this.addStepErr = 'Please complete all fields'
      }
    },
    clearStepInput () {
      this.selectTacticData = null
      this.selectTechniqueData = null
      this.descriptionData = ''
      this.addStepErr = ''
    }
  }
}
</script>
