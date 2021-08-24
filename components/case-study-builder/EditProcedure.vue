<template>
  <v-timeline v-if="procedureData.length" align-top dense>
    <draggable :list="procedureData" :disabled="editing">
      <v-timeline-item v-for="(p, i) in procedureData" :key="i" small>
        <edit-procedure-card
          :key="p"
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
