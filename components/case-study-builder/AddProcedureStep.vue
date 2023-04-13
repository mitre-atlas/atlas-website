<template>
  <div id="addForm">
    <v-card class="mt-5" outlined :style="cardStyle">
      <v-card-title :style="headerStyle">
        Add Procedure Step
        <v-spacer />
      </v-card-title>
      <procedure-form
        :key="procedureStep.tactic"
        v-model="procedureStep"
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
import { statusStyleHeader, statusStyleCard } from '~/assets/validation.js'
/**
 * Wrapper card for adding and editing a case study procedure step
 */
export default {
  name: 'AddProcedureStep',
  props: [
    'value',
    /**
     * Represents the submission status
     * @type {Object}
     */
    'submissionStatus'
  ],
  data () {
    return {
      procedureStep: this.value,
      // Error text for this procedure step box
      addStepErr: ''
    }
  },
  computed: {
    /**
     * Returns true if the submission status has a type
     * @returns {Boolean}
     */
    hasStatus () {
      return !!(this.submissionStatus ?? {}).type
    },
    /**
     * Sets card title font color according to submission state
     */
    headerStyle () {
      return statusStyleHeader(this.submissionStatus)
    },
    /**
     * Sets card outline border color according to submission state
     */
    cardStyle () {
      return statusStyleCard(this.submissionStatus)
    }
  },
  methods: {
    // Constructs the new procedure step object and emits it, or sets an error message
    addProcedureStep () {
      if (this.procedureStep.tactic && this.procedureStep.technique && this.procedureStep.description) {
        // .trim() doesn't modify original string
        this.procedureStep.description = this.procedureStep.description.trim()

        this.$emit('clicked', this.procedureStep)
        this.clearStepInput()
      } else if (this.procedureStep.tactic && this.procedureStep.technique) {
        this.procedureStep.description = ''

        this.$emit('clicked', this.procedureStep)
        this.clearStepInput()
      } else {
        this.addStepErr = 'Please complete all fields'
      }
    },
    // Resets data fields
    clearStepInput () {
      this.procedureStep = {
        selectTacticData: null,
        selectTechniqueData: null,
        descriptionData: ''
      }
      this.addStepErr = ''
    }
  }
}
</script>
