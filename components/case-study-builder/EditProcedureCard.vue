<template>
  <v-card v-if="!editingData">
    <v-card-title v-if="parentTech" style="font-size: 1.1rem">
      {{ parentTechniqueName }}: {{ techniqueName }}
      <v-spacer />
    </v-card-title>
    <v-card-title v-else style="font-size: 1.1rem">
      {{ techniqueName }}
      <v-spacer />
    </v-card-title>
    <v-card-subtitle>
      {{ tacticName }}
    </v-card-subtitle>
    <v-card-text v-html="$md.render(info.description)" />
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue" icon @click="editStep">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="red"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <confirm-delete-dialog
          :name="comboName"
          @cancel="dialog = false"
          @delete="deleteStep"
        >
          <div v-html="info.description" />
        </confirm-delete-dialog>
      </v-dialog>
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
      <v-btn class="ma-2" text color="grey" @click="cancelEdit">
        Cancel
      </v-btn>
      <v-btn id="save_procedure_button" class="ma-2" text color="green" @click="submitEdit">
        Save
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
      descriptionData: this.info.description,
      dialog: false
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
    parentTech () {
      const technique = this.$store.getters.getTechniqueById(this.info.technique)['subtechnique-of']
      const parentTechnique = this.$store.getters.getTechniqueById(technique)
      if (parentTechnique === undefined) {
        return false
      }
      return true
    },
    parentTechniqueName () {
      const technique = this.$store.getters.getTechniqueById(this.info.technique)['subtechnique-of']
      const parentTechnique = this.$store.getters.getTechniqueById(technique)
      if (parentTechnique === undefined) {
        return ''
      }
      return parentTechnique.name
    },
    techniqueName () {
      const technique = this.$store.getters.getTechniqueById(this.info.technique)

      if (technique === undefined) {
        return '(Name not found for technique ' + this.info.technique + ')'
      }
      return technique.name
    },
    comboName () {
      return `${this.techniqueName} - ${this.tacticName}`
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
    deleteStep () {
      this.$emit('deleteClick')
    },
    editStep () {
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
