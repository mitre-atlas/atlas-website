<template>
  <div>
    <v-card-actions class="px-md-4 mx-lg-auto">
      <v-autocomplete
        v-model="selectTacticData2"
        :items="getTactics"
        label="Tactic"
        item-text="name"
        item-value="id"
        @input="$emit('tacticUpdate', selectTacticData2)"
      />

      <v-spacer />

      <v-autocomplete
        v-model="selectTechniqueData2"
        :items="getTechniquesByTacticId(selectTacticData2)"
        label="Technique"
        item-text="name"
        item-value="id"
        :disabled="selectTacticData2 === null"
        @input="$emit('techniqueUpdate', selectTechniqueData2)"
      />
    </v-card-actions>

    <v-card-actions class="px-md-4 mx-lg-auto">
      <v-textarea v-model="descriptionData2" :disabled="selectTacticData2 === null" label="Description" required @input="descriptionUpdate(descriptionData2)" />
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProcedureForm',
  props: ['selectTacticData', 'selectTechniqueData', 'descriptionData'],
  data () {
    return {
      selectTacticData2: this.selectTacticData,
      selectTechniqueData2: this.selectTechniqueData,
      descriptionData2: this.descriptionData
    }
  },
  computed: {
    ...mapGetters(['getTactics', 'getTechniquesByTacticId'])
  },
  methods: {
    // updateValue (inputVal) {
    //   // this.inputVal = inputVal
    //   console.log('here + ' + inputVal)
    //   this.$emit('inputFormData', inputVal)
    // },
    // tacticUpdate (selectTacticData2) {
    //   this.$emit('tacticUpdate', selectTacticData2)
    // },
    // techniqueUpdate (selectTechniqueData2) {
    //   this.$emit('techniqueUpdate', selectTechniqueData2)
    // },
    descriptionUpdate (selectDescriptionData2) {
      this.$emit('descriptionUpdate', selectDescriptionData2)
    }
  }
}
</script>
