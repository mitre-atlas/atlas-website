<template>
  <v-card outlined class="my-5">
    <v-card-title>Add Procedure Steps:</v-card-title>
    <v-card-actions class="px-md-4 mx-lg-auto">
      <v-autocomplete
        v-model="selectTacticData"
        :items="getTactics"
        label="Tactic"
        item-text="name"
        item-value="id"
        @input="updateValue(selectTacticData)"
      />

      <v-spacer />

      <v-autocomplete
        v-model="selectTechniqueData"
        :items="getTechniquesByTacticId(selectTacticData)"
        label="Technique"
        item-text="name"
        item-value="id"
        :disabled="selectTacticData === null"
        @input="updateValue(selectTechniqueData)"
      />
    </v-card-actions>

    <v-card-actions class="px-md-4 mx-lg-auto">
      <v-textarea v-model="descriptionData" :disabled="selectTacticData === null" label="Description" required @input="updateValue(descriptionData)" />
    </v-card-actions>
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AddProcedureStep',
  props: ['selectTactic', 'selectTechnique', 'description'],
  data () {
    return {
      selectTacticData: this.selectTactic,
      selectTechniqueData: this.selectTechnique,
      descriptionData: this.description,
      addStepErr: ''
    }
  },
  computed: {
    ...mapGetters(['getTactics', 'getTechniquesByTacticId'])
  },
  methods: {
    updateValue (inputVal) {
      this.inputVal = inputVal
    },
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
