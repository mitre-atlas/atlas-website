<template>
  <div id="addForm">
    <v-card class="mt-5" outlined :style="cardStyle">
      <v-card-title :style="headerStyle">
        Add Procedure Step
        <v-spacer />
      </v-card-title>
      <procedure-form
        :key="selectTacticData"
        :select-tactic-data="selectTacticData"
        :select-technique-data="selectTechniqueData"
        :description-data="descriptionData"
        :submission-status="submissionStatus"
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

      <v-alert v-if="addStepErr" text color="red" type="error" dense>
        {{ addStepErr }}
      </v-alert>
    </v-card>
    <v-card-subtitle v-if="hasStatus" class="py-2" :style="headerStyle">
      {{
        submissionStatus.message
      }}
    </v-card-subtitle>
  </div>
</template>

<script>
export default {
  name: 'AddProcedureStep',
  props: [
    'selectTactic',
    'selectTechnique',
    'description',
    'addingStep',
    'submissionStatus'
  ],
  data () {
    return {
      selectTacticData: this.selectTactic,
      selectTechniqueData: this.selectTechnique,
      descriptionData: this.description,
      addStepErr: '',
      addingBool: this.addingStep
    }
  },
  computed: {
    hasStatus () {
      return !!(this.submissionStatus ?? {}).type
    },
    isInErrorState () {
      return (this.submissionStatus ?? {}).type === 'error'
    },
    isInWarningState () {
      return (this.submissionStatus ?? []).type === 'warning'
    },
    headerStyle () {
      if (this.isInErrorState) {
        return 'color: #FF5252'
      } else if (this.isInWarningState) {
        return 'color: #DAA520'
      } else {
        return ''
      }
    },
    cardStyle () {
      const style = {}
      if (this.isInErrorState) {
        style['border-color'] = '#FF5252'
        style['border-width'] = '2px'
      } else if (this.isInWarningState) {
        style['border-color'] = '#DAA520'
        style['border-width'] = '2px'
      }
      return style
    }
  },
  methods: {
    addProcedureStep () {
      if (this.selectTacticData && this.selectTechniqueData && this.descriptionData) {
        // .trim() doesn't modify original string
        this.descriptionData = this.descriptionData.trim()
        const newStep = {
          tactic: this.selectTacticData,
          technique: this.selectTechniqueData,
          description: this.descriptionData
        }
        this.$emit('clicked', newStep)
        this.clearStepInput()
      } else if (this.selectTacticData && this.selectTechniqueData) {
        // .trim() doesn't modify original string
        this.descriptionData = ''
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
