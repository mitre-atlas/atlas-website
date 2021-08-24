<template>
  <div id="addForm">
    <v-card outlined class="my-5">
      <v-card-title>
        Add Procedure Steps:
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
        <v-btn class="ma-2" outlined color="blue" @click="addProcedureStep">
          Add Step
        </v-btn>
        <v-btn class="ma-2" outlined color="red" @click="clearStepInput">
          Clear
        </v-btn>
      </v-card-actions>
      <v-col sm="6">
        <v-alert v-if="addStepErr" color="red" outlined type="error" dense>
          {{ addStepErr }}
        </v-alert>
      </v-col>
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
