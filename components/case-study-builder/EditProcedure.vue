<template>
  <v-timeline v-if="procedureData.length" align-top dense>
    <draggable :list="procedureData" :disabled="editing" handle=".handle">
      <!-- Key with index and technique for uniqueness -->
      <v-timeline-item v-for="(p, i) in procedureData" :key="i + p.technique" small>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="fa fa-align-justify handle" v-bind="attrs" v-on="on">mdi-arrow-up-down</v-icon>
          </template>
          <span>Click here to drag procedures to sort them</span>
        </v-tooltip>
        <edit-procedure-card
          :info="p"
          :editing="editing"
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
  props: ['procedure'],
  data () {
    return {
      procedureData: this.procedure,
      editedObj: {},
      editing: false
    }
  },
  methods: {
    editStep (editedObj) {
      this.editedObj = editedObj
    },
    updateEdit () {
      this.editing = !this.editing
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
