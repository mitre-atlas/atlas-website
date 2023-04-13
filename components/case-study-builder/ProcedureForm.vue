<template>
  <div>
    <v-card-text class="px-md-4 mx-lg-auto">
      <v-row>
        <v-col cols="12" lg="6">
          <hover-preview :is-autocomplete="true">
            <v-autocomplete
              id="tactic_selection"
              v-model="procedureStep.tactic"
              eager
              :items="getDataObjectsByType('tactics')"
              label="Tactic"
              outlined
              prepend-inner-icon="mdi-magnify"
              item-text="name"
              item-value="id"
              @input="
                procedureStep.technique = ''
                $emit('input', procedureStep)"
            >
              <template #item="{ item }" class="menu-item-wrapper">
                <div class="menu-item">
                  {{ item.name }}
                </div>
              </template>
            </v-autocomplete>
          </hover-preview>
        </v-col>
        <v-col cols="12" lg="6">
          <hover-preview :is-autocomplete="true">
            <!--
              Fires upon selecting a technique in the dropdown
              @arg {String} selectTechniqueData2 - the selected technique ID
             -->
            <v-autocomplete
              id="technique_selection"
              v-model="procedureStep.technique"
              :items="mapTechAndSub"
              label="Technique"
              outlined
              eager
              prepend-inner-icon="mdi-magnify"
              :filter="alsoMatchSubtechniquesOfMatchingTechniques"
              item-text="name"
              item-value="id"
              :disabled="procedureStep.tactic === null"
              @input="$emit('input', procedureStep)"
            >
              <template #item="data" class="menu-item-wrapper">
                <div class="menu-item">
                  <!-- Small icon with left and right padding to slightly indent and offset from subtechnique name -->
                  <v-icon
                    v-if="!('tactics' in data.item)"
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
          </hover-preview>
        </v-col>
      </v-row>

      <v-textarea
        id="procedure_description"
        v-model="procedureStep.description"
        :disabled="procedureStep.tactic === null"
        label="Description"
        hint="Describe how this technique was used in the case study"
        required
        outlined
        prepend-inner-icon="mdi-text"
        auto-grow
        @input="$emit('input', procedureStep)"
      />
    </v-card-text>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

/**
 * Form for inputting a case study procedure step
 * @see {AddProcedureStep.vue} for the wrapper card around this component
 */
export default {
  name: 'ProcedureForm',
  props: [
    /**
     * V-model from parent component that allows the user to edit
     * and replace procedure steps.
     */
    'value'
  ],
  data () {
    return {
      procedureStep: this.value
    }
  },
  computed: {
    ...mapGetters([
      'getDataObjectsByType',
      'getDataObjectsByTypeKeyContainingValue',
      'subtechnique/getParent'
    ]),
    /**
     * Constructs the item list for the technique dropdown,
     * which is filtered by tactic and contains subtechniques
     * after their parent techniques
     * @type {object[]}
     */
    mapTechAndSub () {
      // Parent techniques that have the selected tactic as a parent
      const techs = this.getDataObjectsByTypeKeyContainingValue(
        'techniques',
        'tactics',
        this.procedureStep.tactic
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
    /**
     * Filter for technique selection dropdown to include any subtechniques
     * in matches for parent technique names
     * @param {Object} item - (sub)technique data object
     * @param {String} queryText - search text
     * @param {String} itemText - (sub)technique name
     * @return {Boolean} Whether there is a match between query and (sub)technique name
     */
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
