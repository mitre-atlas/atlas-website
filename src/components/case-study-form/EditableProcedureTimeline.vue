<template>
  <VueDraggable
    v-model="procedures"
    handle=".handle"
    :animation="150"
    class="list"
    ghostClass="ghost"
  >
    <div
      v-for="(procedure, i) in procedures"
      :key="i + procedure.tactic + procedure.technique + procedure.description"
      dot-color="blue"
      size="medium"
      width="100%"
      class="mb-3 pl-8 item"
    >
      <AddProcedure
        v-if="i === editIndex"
        :editProcedure="procedure"
        :editIndex="editIndex"
        @cancel="editIndex = null"
        @update="updateProcedureStep"
      />
      <v-card
        v-else
        :title="getTechniqueLabel(procedure)"
        :subtitle="mainStore.getDataObjectById(procedure.tactic).name"
        variant="outlined"
        style="border: solid 1px; border-color: lightgray"
      >
        <template #append>
          <div :style="{ cursor: editIndex || procedures.length === 1 ? 'not-allowed' : 'grab' }">
            <v-icon
              :style="{ 'pointer-events': editIndex || procedures.length === 1 ? 'none' : '' }"
              class="handle"
              :color="editIndex || procedures.length === 1 ? 'grey-lighten-1' : 'grey-darken-3'"
            >
              mdi-arrow-up-down
            </v-icon>
          </div>
        </template>
        <v-card-text v-if="procedure.description" v-html="md.render(procedure.description)" />
        <v-card-actions>
          <v-spacer />
          <v-btn icon="mdi-pencil" color="blue" @click="editIndex = i" />
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-delete" color="red" />
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title class="text-wrap">
                  {{ `Delete "${getTechniqueLabel(procedure)}"?` }}
                </v-card-title>
                <v-card-text>
                  <div v-html="procedure.description" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
                  <v-btn text="Delete" color="red" @click="deleteProcedure(i, isActive)"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </div>
  </VueDraggable>
</template>

<script setup>
import { useMain } from '@/stores/main'
import { inject, ref } from 'vue'
import AddProcedure from './AddProcedure.vue'
import { VueDraggable } from 'vue-draggable-plus'

const md = inject('markdownit')

const mainStore = useMain()

const procedures = defineModel()

function getTechniqueLabel(procedure) {
  if (mainStore.getDataObjectById(procedure.technique) === undefined) {
    return `(Label not found for technique ${procedure.technique})`
  }
  return mainStore.getDataObjectById(procedure.technique)?.label
}

const editIndex = ref()

function updateProcedureStep(updatedProcedure, index) {
  procedures.value[index] = updatedProcedure
  editIndex.value = null
}

function deleteProcedure(deleteIndex, dialogIsActive) {
  // Delete the procedure step at the given dialog
  procedures.value.splice(deleteIndex, 1)
  // Close the dialog
  dialogIsActive.value = false
}
</script>

<style scoped>
.list {
  border-left: 2px solid #e0e0e0;
}

.list .item {
  position: relative;
}

.list .item::before {
  content: '';
  width: 16px;
  height: 16px;
  border-radius: 10px;
  display: block;
  background: #005b94;
  position: absolute;
  left: -9px;
  top: 50%;
}

.ghost .v-card {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
