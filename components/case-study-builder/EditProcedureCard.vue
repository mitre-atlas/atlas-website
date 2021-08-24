<template>
  <v-card v-if="!editingData">
    <v-card-title>
      {{ getTechniqueById(info.technique).name }}
      <v-spacer />
      <v-icon>mdi-arrow-up-down</v-icon>
    </v-card-title>
    <v-card-subtitle>
      {{ tacticName }}
    </v-card-subtitle>
    <v-card-text v-html="info.description" />
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue" icon @click="editStep">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn color="red" icon @click="deleteStep">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-card v-else>
    <procedure-form
      :key="selectTacticData"
      :select-tactic-data="selectTacticData"
      :select-technique-data="selectTechniqueData"
      :description-data="descriptionData"
      @tacticUpdate="selectTacticData = $event"
      @techniqueUpdate="selectTechniqueData = $event"
      @descriptionUpdate="descriptionData = $event"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn color="green" icon @click="submitEdit">
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <v-btn color="red" icon @click="cancelEdit">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EditProcedureCard',
  props: ['info', 'editedObj', 'editing'],
  data () {
    return {
      editingData: this.editing,
      selectTacticData: this.info.tactic,
      selectTechniqueData: this.info.technique,
      descriptionData: this.info.description
    }
  },
  computed: {
    ...mapGetters([
      'getTacticById',
      'getTechniqueById'
    ]),
    tacticName () {
      const tactic = this.$store.getters.getTacticById(this.info.tactic)

      if (tactic === undefined) {
        return '(Name not found for technique ' + this.info.tactic + ')'
      }
      return tactic.name
    },
    techniqueName () {
      const technique = this.$store.getters.getTechniqueById(this.info.technique)

      if (technique === undefined) {
        return '(Name not found for technique ' + this.info.technique + ')'
      }
      return technique.name
    },
    tacticId () {
      const tactic = this.$store.getters.getTacticById(this.info.tactic)

      if (tactic === undefined) {
        // Dummy placeholder
        return 'tactic_not_found'
      }
      return tactic.id
    },
    techniqueId () {
      const technique = this.$store.getters.getTechniqueById(this.info.technique)

      if (technique === undefined) {
        // Dummy placeholder
        return 'technique_not_found'
      }
      return technique.id
    }
  },
  methods: {
    // updateValue (inputVal) {
    //   this.inputVal = inputVal
    // },
    deleteStep () {
      this.$emit('deleteClick')
    },
    editStep () {
      // console.log('edit clicked')
      this.editingData = true
      this.$emit('updateEdit', this.editingData)
    },
    submitEdit () {
      this.editingData = false
      this.$emit('updateEdit', this.editingData)
      const editedObj = {
        tactic: this.selectTacticData,
        technique: this.selectTechniqueData,
        description: this.descriptionData
      }
      this.$emit('editClick', editedObj)
      this.$emit('replace')
    },
    cancelEdit () {
      this.editingData = false
      this.$emit('updateEdit', this.editingData)
    }
  }
}
</script>
