<template>
  <v-card v-if="!editingData">
    <v-card-title style="font-size: 1.1rem">
      {{ techniqueLabel }}
      <v-spacer />
    </v-card-title>

    <v-card-subtitle>
      {{ tacticName }}
    </v-card-subtitle>
    <v-card-text
      style="color: black"
      class="tw-prose tw-max-w-none"
      v-html="$md.render(procedureStep.description)"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="blue"
        icon
        @click="
          editingData = true
          $emit('updateEdit', editingData)
        "
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" width="500">
        <template #activator="{ on, attrs }">
          <v-btn color="red" icon v-bind="attrs" v-on="on">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <confirm-delete-dialog
          :name="comboName"
          @cancel="dialog = false"
          @delete="$emit('deleteClick')"
        >
          <div v-html="info.description" />
        </confirm-delete-dialog>
      </v-dialog>
    </v-card-actions>
  </v-card>

  <div v-else>
    <v-card :style="cardStyle" :outlined="hasStatus">
      <v-card-title :style="headerStyle">
        Edit Procedure Step
        <v-spacer />
      </v-card-title>
      <procedure-form :key="procedureStep.tactic" v-model="tempStep" />
      <v-card-actions>
        <v-spacer />
        <v-btn class="ma-2" text color="grey" @click="cancelEdit">
          Cancel
        </v-btn>
        <v-btn
          id="save_procedure_button"
          class="ma-2"
          text
          color="green"
          @click="submitEdit"
        >
          Save
        </v-btn>
      </v-card-actions>
      <v-alert v-if="saveEditErr" text color="red" type="error" dense>
        {{ saveEditErr }}
      </v-alert>
    </v-card>
    <v-card-subtitle v-if="hasStatus" class="py-2" :style="headerStyle">
      {{ submissionStatus.message }}
    </v-card-subtitle>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { statusStyleHeader, statusStyleCard } from '~/assets/validation.js'

/**
 * Card for editing a single procedure step
 */
export default {
  name: 'EditProcedureCard',
  props: [
    /**
     * V-model from EditProcedure.vue that allows the user to edit
     * and replace procedure steps.
     */
    'value',
    /**
     * Procedure object with
     * ```
     * {
     *    tactic: str (ID)
     *    technique: str (ID)
     *    description: str
     * }
     * ```
     * @type {Object}
     */
    'info',
    /**
     * Submission status object
     * ```
     * {
     *    type: str,
     *    color: str,
     *    description: str
     * }
     * ```
     * @type {Object}
     */
    'submissionStatus'
  ],
  data () {
    return {
      // Whether this procedure step card is in edit mode
      editingData: false,
      // Error message to display at the bottom of this card
      saveEditErr: '',
      // Whether the delete confirmation dialog is open
      dialog: false,
      // Object to replace procedure step, passed with v-model
      procedureStep: this.value,
      // Object being edited
      tempStep: {
        tactic: this.value.tactic,
        technique: this.value.technique,
        description: this.value.description
      }
    }
  },
  computed: {
    ...mapGetters(['getDataObjectById']),
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
    },
    /**
     * The tactic data object identified by the ID in the procedure step
     * @type {Object}
     */
    tactic () {
      return this.getDataObjectById(this.procedureStep.tactic)
    },
    /**
     * The technique data object identified by the ID in the procedure step
     * @type {Object}
     */
    technique () {
      return this.getDataObjectById(this.procedureStep.technique)
    },
    /**
     * The tactic name, or placeholder for not found
     * @type {String}
     */
    tacticName () {
      if (this.tactic === undefined) {
        return '(Name not found for tactic ' + this.procedureStep.tactic + ')'
      }
      return this.tactic.name
    },
    /**
     * The technique name, or placeholder for not found
     * @type {String}
     */
    techniqueName () {
      if (this.technique === undefined) {
        return (
          '(Name not found for technique ' + this.procedureStep.technique + ')'
        )
      }
      return this.technique.name
    },
    /**
     * The technique label, which is the name, or `parent name: subtechnique name` where applicable
     * @type {String}
     */
    techniqueLabel () {
      if (this.technique === undefined) {
        return (
          '(Label not found for technique ' + this.procedureStep.technique + ')'
        )
      }
      return this.technique.label
    },
    /**
     * The combined representation of the tactic and technique names
     * @type {String}
     */
    comboName () {
      return `${this.techniqueName} - ${this.tacticName}`
    }
  },
  methods: {
    /**
     * Validates that data is inputted, then constructs and emits the new procedure step
     */
    submitEdit () {
      this.procedureStep = this.tempStep
      if (!this.procedureStep.technique) {
        this.saveEditErr = 'Please complete all fields'
      } else {
        this.editingData = false
        this.$emit('updateEdit', this.editingData)
        // .trim() doesn't modify original string
        this.procedureStep.description = this.procedureStep.description.trim()
        this.$emit('input', this.procedureStep)
        /**
         * Lets listeners know to replace the current step item with this one
         */
        this.$emit('replace')
      }
    },
    // Called when the cancel button on this procedure step card is clicked
    cancelEdit () {
      this.editingData = false
      // TODO LW info and procedureStep are the same
      // ^ KH I think info exists to revert to original step if user
      // cancels after starting an edit
      this.procedureStep.tactic = this.info.tactic
      this.procedureStep.technique = this.info.technique
      this.$emit('updateEdit', this.editingData)
    }
  }
}
</script>
