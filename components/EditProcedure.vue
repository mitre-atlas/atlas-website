<template>
  <v-timeline v-if="procedureData.length" align-top dense>
    <draggable :list="procedureData">
      <v-timeline-item v-for="(p, i) in procedureData" :key="i" small>
        <v-row align="center" justify="center">
          <v-col sm="10">
            <procedure-card :info="p" />
          </v-col>
          <v-col sm="2">
            <v-btn color="blue" icon @click="editStep"> <v-icon>mdi-pencil</v-icon> </v-btn>
            <v-btn color="red" icon @click="deleteStep(i)"> <v-icon>mdi-delete</v-icon> </v-btn>
          </v-col>
        </v-row>
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
      procedureData: this.procedure
    }
  },
  methods: {
    editStep () {
      console.log('edit step')
    },
    deleteStep (i) {
      this.procedureData.splice(i, 1)
    }
  }
}
</script>
