<template>
  <v-timeline 
    side="end"
  >
    <v-timeline-item
      v-for="(procedure, i) in procedure"
      :key="i"
      dot-color="blue"
      size="medium"
      width="100%"
    >
      <AddProcedure 
        v-if="i === editIndex"
        :editProcedure="procedure"
        :editIndex="editIndex"
        @cancel="editIndex = null"
        @update="emitUpdate"
      />
      <v-card
        v-else
        :title="getTechniqueLabel(procedure)"
        :subtitle="mainStore.getDataObjectById(procedure.tactic).name"
      >
        <v-card-text
          v-if="procedure.description"
          v-html="md.render(procedure.description)"
        />
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
                  <div v-html="procedure.description"/>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    text="Cancel"
                    @click="isActive.value = false"
                  ></v-btn>
                  <v-btn
                    text="Delete"
                    color="red"
                    @click="isActive.value = false; emitDelete(i)"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
  import { useMain } from "@/stores/main"
  import { inject, ref } from "vue"
  import AddProcedure from './AddProcedure.vue'
  const md = inject('markdownit')

  const mainStore = useMain()

  const emit = defineEmits(['updateProcedureStep', 'delete'])
  const { procedure } = defineProps([
    /**
     * Array of procedure entered in case study form
     * @type {Array}
     */
    'procedure',
  ]);

  function getTechniqueLabel(procedure) {
    return mainStore.getDataObjectById(procedure.technique).label
  }

  const editIndex = ref()

  function emitUpdate(editedProcedure, index) {
    emit('updateProcedureStep', editedProcedure, index)
    editIndex.value = null
  }

  function emitDelete(deleteIndex) {
    emit('delete', deleteIndex)
    if(editIndex.value > deleteIndex) {
      editIndex.value--
    }
  }

</script>