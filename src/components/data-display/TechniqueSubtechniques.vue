<template>
  <v-expand-transition>
    <v-card v-if="hasSubtechniques || hasOtherSubtechniques" class="mb-4 ml-8" variant="outlined">
      <v-list>
        <v-list-group v-if="hasSubtechniques" value="Subtechniques">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" class="text-capitalize text-h6">
              <v-icon left>mdi-format-list-bulleted</v-icon>
              Subtechniques
            </v-list-item>
          </template>
          <v-list-item
            v-for="subtech in subtechniquesList"
            :key="subtech.id"
            :to="subtech.route"
            class="px-8"
          >
            <v-list-item-title>{{ subtech.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ subtech.id }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-group>
        <v-list-group v-if="hasOtherSubtechniques" value="Other Subtechniques">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" class="text-capitalize text-h6">
              <v-icon left>mdi-format-list-bulleted</v-icon>
              Other Subtechniques
            </v-list-item>
          </template>
          <template v-for="subtech in otherSubtechniquesList" :key="subtech.id">
            <v-list-item v-if="isCurrentTechnique(subtech.id)" class="px-8 bg-grey-lighten-4">
              <v-list-item-title>{{ subtech.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ subtech.id }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-else :to="subtech.route" class="px-8">
              <v-list-item-title>{{ subtech.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ subtech.id }}</v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-list-group>
      </v-list>
    </v-card>
  </v-expand-transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  subtechniques: {
    type: Array,
    default: () => []
  },
  otherSubtechniques: {
    type: Array,
    default: () => []
  },
  currentTechnique: {
    type: Object,
    default: () => ({})
  }
})

const hasSubtechniques = computed(() => {
  return props.subtechniques?.length > 0
})

const hasOtherSubtechniques = computed(() => {
  return props.otherSubtechniques?.length > 0
})

const subtechniquesList = computed(() => {
  return props.subtechniques || []
})

const otherSubtechniquesList = computed(() => {
  const subtechniques = [...(props.otherSubtechniques || [])]
  subtechniques.push(props.currentTechnique)
  return subtechniques.sort((a, b) => a.id.localeCompare(b.id))
})

const isCurrentTechnique = (techId) => {
  return techId === props.currentTechnique.id
}
</script>
