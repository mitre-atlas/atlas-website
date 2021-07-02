<template>
  <div>
    <v-card-actions class="px-md-4 mx-lg-auto">
      <v-autocomplete
        v-model="selectTacticData2"
        :items="getTactics"
        label="Tactic"
        item-text="name"
        item-value="id"
        @input="tacticUpdate(selectTacticData2)"
      />

      <v-spacer />

      <v-autocomplete
        v-model="selectTechniqueData2"
        :items="mapTechAndSub"
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
    ...mapGetters(['getTactics', 'getTechniquesByTacticId', 'getTechSubByTacticId']),
    mapTechAndSub () {
      const techs = this.getTechSubByTacticId(this.selectTacticData2)
      for (let i = 0; i < techs.length; i++) {
        if (techs[i].subtechniques) {
          for (let j = 0; j < techs[i].subtechniques.length; j++) {
            techs.push(techs[i].subtechniques[j])
          }
        }
      }
      return techs
    }
  },
  methods: {
    // updateValue (inputVal) {
    //   // this.inputVal = inputVal
    //   console.log('here + ' + inputVal)
    //   this.$emit('inputFormData', inputVal)
    // },
    tacticUpdate (selectTacticData2) {
      this.selectTacticData2 = selectTacticData2
      this.$emit('tacticUpdate', selectTacticData2)
    },
    // techniqueUpdate (selectTechniqueData2) {
    //   this.$emit('techniqueUpdate', selectTechniqueData2)
    // },
    descriptionUpdate (selectDescriptionData2) {
      this.$emit('descriptionUpdate', selectDescriptionData2)
    }
  }
}
</script>
