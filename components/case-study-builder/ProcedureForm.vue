<template>
  <div>
    <hover-preview
      :y-off="-24"
      :x-off="hoverOffset"
      :appear-right="appearRight"
      :from-right="fromRight"
      :new-target-id="hoverTargetID"
      :parent-event="mouseEvent"
    />

    <v-card-text class="px-md-4 mx-lg-auto">
      <v-row>
        <v-col cols="12" lg="6">
          <hover-preview2 :is-group="true">
            <v-autocomplete
              id="tactic_selection"
              v-model="selectTacticData2"
              eager
              :items="getDataObjectsByType('tactics')"
              label="Tactic"
              outlined
              prepend-inner-icon="mdi-magnify"
              item-text="name"
              item-value="id"
              @input="tacticUpdate(selectTacticData2)"
            >
              <template #item="{ item }" class="menu-item-wrapper">
                <div class="menu-item">
                  {{ item.name }}
                </div>
              </template>
            </v-autocomplete>
          </hover-preview2>
        </v-col>
        <v-col cols="12" lg="6">
          <hover-preview2 :is-group="true">
            <v-autocomplete
              id="technique_selection"
              v-model="selectTechniqueData2"
              :items="mapTechAndSub"
              label="Technique"
              outlined
              eager
              prepend-inner-icon="mdi-magnify"
              :filter="alsoMatchSubtechniquesOfMatchingTechniques"
              item-text="name"
              item-value="id"
              :disabled="selectTacticData2 === null"
              @input="$emit('techniqueUpdate', selectTechniqueData2)"
            >
              <template #item="data" class="menu-item-wrapper">
                <div class="menu-item">
                  <!-- Small icon with left and right padding to slightly indent and offset from subtechnique name -->
                  <v-icon
                    v-if="'subtechnique-of' in data.item"
                    small
                    left
                    right
                  >
                    mdi-subdirectory-arrow-right
                  </v-icon>
                  {{ data.item.name }}
                </div>
              </template>
            </v-autocomplete>
          </hover-preview2>
        </v-col>
      </v-row>

      <v-textarea
        id="procedure_description"
        v-model="descriptionData2"
        :disabled="selectTacticData2 === null"
        label="Description"
        hint="Describe how this technique was used in the case study"
        required
        outlined
        prepend-inner-icon="mdi-text"
        auto-grow
        @input="descriptionUpdate(descriptionData2)"
      />
    </v-card-text>
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
      descriptionData2: this.descriptionData,

      mouseEvent: null,
      hoverTargetID: '',
      hoverOffset: 0,
      appearRight: false,
      fromRight: false
    }
  },
  computed: {
    ...mapGetters([
      'getDataObjectsByType',
      'getDataObjectsByTypeKeyContainingValue',
      'subtechnique/getParent'
    ]),
    mapTechAndSub () {
      // Parent techniques that have the selecetd tactic as a parent
      const techs = this.getDataObjectsByTypeKeyContainingValue(
        'techniques',
        'tactics',
        this.selectTacticData2
      )

      for (let i = 0; i < techs.length; i++) {
        // Add subtechniques, if exist
        if (techs[i].subtechniques) {
          for (let j = 0; j < techs[i].subtechniques.length; j++) {
            const subtechnique = techs[i].subtechniques[j]
            // Insert into techniques array below the parent technique and any prior subtechniques
            const index = i + 1 + j
            techs.splice(index, 0, subtechnique)
          }
        }
      }
      return techs
    }
  },
  methods: {
    tacticUpdate (selectTacticData2) {
      this.selectTacticData2 = selectTacticData2
      this.$emit('tacticUpdate', selectTacticData2)
    },
    // techniqueUpdate (selectTechniqueData2) {
    //   this.$emit('techniqueUpdate', selectTechniqueData2)
    // },
    descriptionUpdate (selectDescriptionData2) {
      this.$emit('descriptionUpdate', selectDescriptionData2)
    },
    alsoMatchSubtechniquesOfMatchingTechniques (item, queryText, itemText) {
      // Match current item text
      let isMatch = itemText
        .toLocaleLowerCase()
        .includes(queryText.toLocaleLowerCase())
      // Also match subtechniques of matching techniques
      if ('subtechnique-of' in item && !isMatch) {
        // Get the parent technique name of this subtechnique
        const parentTechniqueName = this['subtechnique/getParent'](item).name
        // Check if that name matches the query
        isMatch = parentTechniqueName
          .toLocaleLowerCase()
          .includes(queryText.toLocaleLowerCase())
      }
      return isMatch
    }
  }
}
</script>

<style scoped>
.menu-item {
  width: 100%;
  height: 100%;
  position: absolute;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;

  flex: 1 1 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-item-wrapper {
  align-items: center;
  position: relative;
  width: 10%;
}
</style>
