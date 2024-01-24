<template>
  <v-timeline
    side="end"
    class="text-left"
  >
    <v-timeline-item
      v-for="(procedure, i) in procedure"
      :key="i"
      dot-color="blue"
      size="medium"
    >
      <v-card
        :title="getTechniqueLabel(procedure)"
        :subtitle="mainStore.getDataObjectById(procedure.tactic).name"
      >
        <v-card-text
          v-if="procedure.description"
          v-html="md.render(procedure.description)"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn icon="mdi-pencil" color="blue" />
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
                    @click="isActive.value = false; $emit('delete', i)"
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
  import { inject, computed } from "vue";
  const md = inject('markdownit')

  const mainStore = useMain()

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

</script>