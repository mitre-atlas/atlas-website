<template>
  <v-timeline v-if="procedureData.length" align-top dense>
    <draggable :list="procedureData" :disabled="areChangesUnsaved" handle=".handle">
      <!-- Key with index and technique for uniqueness -->
      <v-timeline-item v-for="(p, i) in procedureData" :key="i + p.technique" small>
        <v-icon class="fa fa-align-justify handle">
          mdi-arrow-up-down
        </v-icon>
        <edit-procedure-card
          :id="i + p.technique"
          ref="editProcedureCards"
          v-model="procedureData[i]"
          :info="p"
          :submission-status="(enableStatusHighlighting) ? {type: 'warning', message: 'Unsaved changes'} : {}"
          @deleteClick="deleteStep(i)"
          @replace="
            replace(i)"
          @updateEdit="updateEdit"
        />
      </v-timeline-item>
    </draggable>
  </v-timeline>
</template>

<script>
import draggable from 'vuedraggable'
/**
 * Timeline with draggable case study procedure cards
 */
export default {
  name: 'EditProcedure',
  components: { draggable },
  props: [
    /**
     * List of procedure objects, v-model used from createstudy.vue
     * @type {Object[]}
     */
    'value',
    /**
     * Whether to allow the cards to show color borders based on error or warning status
     * @type {Boolean}
     */
    'enableStatusHighlighting'
  ],
  data () {
    return {
      /**
       * List of procedure objects
       * @type {Object[]}
       */
      procedureData: this.value,
      // Count of the number of steps being edited
      editingCount: 0,
      /**
     * Edited procedure object to update procedure card
     * ```
     * {
     *    tactic: str (ID)
     *    technique: str (ID)
     *    description: str
     * }
     * ```
     * @type {Object}
     */
      editedObj: {}
    }
  },
  computed: {
    /**
     * @type {Boolean}
     */
    areChangesUnsaved () {
      return this.editingCount > 0
    }
  },
  methods: {
    /**
     * Updates the editing count based on state and emits whether there are unsaved changes
     * @param {Boolean} stepEditingState
     */
    updateEdit (stepEditingState) {
      if (stepEditingState) {
        this.editingCount += 1
      } else {
        this.editingCount -= 1
      }
      /**
       * @type {Boolean}
       */
      this.$emit('areChangesUnsaved', this.areChangesUnsaved)
    },
    /**
     * Replaces the `i`th item in the procedure list with the edited object
     * @param {Number} i
     */
    replace (i) {
      // this.procedureData.splice(i, 1, this.editedObj)
      /**
       * @type {Object[]}
       */
      this.$emit('input', this.procedureData)
    },
    /**
     * Deletes the `i`th item in the procedure list
     * @param {Number} i
     */
    deleteStep (i) {
      this.procedureData.splice(i, 1)
    }
  }
}
</script>
<style scoped>
  .handle {
    float:right;
    padding-top:2%;
    padding-right: 1%;
    z-index: 1;
    cursor: -webkit-grab; /* Chrome 1-21, Safari 4+ */
    cursor: -moz-grab; /* Firefox 1.5-26 */
    cursor: grab;
  }

  .handle:active {
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
    cursor: grabbing;
  }

</style>
