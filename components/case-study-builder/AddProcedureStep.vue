<template>
  <div id="addForm">
    <v-card class="my-5">
      <v-card-title>
        Add Procedure Step
        <v-spacer />
        <v-btn color="red" icon @click="$emit('addingBoolUpdate', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
        <v-btn text color="red" @click="clearStepInput">
          Clear
        </v-btn>
        <v-btn text color="blue" @click="addProcedureStep">
          Add Step
        </v-btn>
      </v-card-actions>

        <v-alert v-if="addStepErr" text type="error" dense>
          {{ addStepErr }}
        </v-alert>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AddProcedureStep',
  props: ['selectTactic', 'selectTechnique', 'description', 'addingStep'],
  data () {
    return {
      selectTacticData: this.selectTactic,
      selectTechniqueData: this.selectTechnique,
      descriptionData: this.description,
      addStepErr: '',
      addingBool: this.addingStep
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
