<template>
  <div>
    <hover-preview
    :y-off="-24"
    :x-off="hoverOffset"
    :appear-right="appearRight"
    :from-right="fromRight"
    :new-target-id="hoverTargetID"
    :parent-event="mouseEvent" />

    <v-card-actions class="px-md-4 mx-lg-auto">

      <v-autocomplete
        v-model="selectTacticData2"
        :items="getTactics"
        label="Tactic"
        item-text="name"
        item-value="id"
        @input="tacticUpdate(selectTacticData2)"
      >
      <template
      class="menu-item-wrapper"
      v-slot:item="data">

        <div
        class="menu-item"
        @mouseenter="function(event){ passMouse(event, data.item) }"
        @mouseleave="passMouse"
        @click="passMouse">
        {{ data.item.name }}
        </div>
      </template>
      </v-autocomplete>

      <v-spacer />

      <v-autocomplete
        v-model="selectTechniqueData2"
        :items="mapTechAndSub"
        label="Technique"
        item-text="name"
        item-value="id"
        :disabled="selectTacticData2 === null"
        @input="$emit('techniqueUpdate', selectTechniqueData2)"
        >
        <template
        class="menu-item-wrapper"
        v-slot:item="data">

          <div
          class="menu-item"
          @mouseenter="function(event){ passMouse(event, data.item) }"
          @mouseleave="passMouse"
          @click="passMouse">
          {{ data.item.name }}
          </div>
        </template>
      </v-autocomplete>
    </v-card-actions>

    <v-card-actions class="px-md-4 mx-lg-auto">
      <v-textarea v-model="descriptionData2" :disabled="selectTacticData2 === null" label="Description" required @input="descriptionUpdate(descriptionData2)" />
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HoverPreview from '../components/HoverPreview.vue'

export default {
  components: { HoverPreview },
  name: 'ProcedureForm',
  props: ['selectTacticData', 'selectTechniqueData', 'descriptionData'],
  data () {
    return {
      selectTacticData2: this.selectTacticData,
      selectTechniqueData2: this.selectTechniqueData,
      descriptionData2: this.descriptionData,

      mouseEvent: null,
      hoverTargetID: 'AML.TA0000',
      hoverOffset: 0,
      appearRight: false,
      fromRight: false
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
    passMouse (event, hoverItem = false) {
      // console.log(`Got '${event.type}' event for ${hoverItem ? hoverItem.name : 'none'}`)
      if (hoverItem) { this.hoverTargetID = hoverItem.id }
      if (hoverItem['object-type'] === 'technique') {
        this.appearRight = false
        this.fromRight = true
        this.hoverOffset = -50 - 256 // 256 is the size of the sidebar
      } else {
        this.appearRight = true
        this.fromRight = false
        this.hoverOffset = 40 - 256
      }
      this.mouseEvent = event
    },
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
    width: 10%
  }

</style>
