<template>
  <v-timeline v-if="procedureData.length" align-top dense>
    <draggable :list="procedureData" :disabled="areChangesUnsaved" handle=".handle">
      <!-- Key with index and technique for uniqueness -->
      <v-timeline-item v-for="(p, i) in procedureData" :key="i + p.technique" small>
        <v-icon class="fa fa-align-justify handle">
          mdi-arrow-up-down
        </v-icon>
        <edit-procedure-card
          ref="editProcedureCards"
          :info="p"
          :id="i + p.technique"
          :submission-status="(enableStatusHighlighting) ? {type: 'warning', message: 'Unsaved changes'} : {}"
          @deleteClick="deleteStep(i)"
          @editClick="editStep"
          @replace="replace(i)"
          @updateEdit="updateEdit"
        />
      </v-timeline-item>
    </draggable>
  </v-timeline>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'EditProcedure',
  components: { draggable },
  props: ['procedure', 'enableStatusHighlighting'],
  data () {
    return {
      procedureData: this.procedure,
      editedObj: {},
      editingCount: 0 // Count of the number of steps being edited
    }
  },
  computed: {
    areChangesUnsaved () {
      return this.editingCount > 0
    }
  },
  methods: {
    editStep (editedObj) {
      this.editedObj = editedObj
    },
    updateEdit (stepEditingState) {
      if (stepEditingState) {
        this.editingCount += 1
      } else {
        this.editingCount -= 1
      }
      this.$emit('areChangesUnsaved', this.areChangesUnsaved)
    },
    replace (i) {
      this.procedureData.splice(i, 1, this.editedObj)
      this.$emit('updateProcedure', this.procedureData)
    },
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
