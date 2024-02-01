<template>
  <div class="ma-5">
    <v-row justify="center">
      <div :class="`text-${statValueSize} text-lightBlue`">
        {{ value }}
      </div>
    </v-row>
    <v-row justify="center">
      <div :class="`text-${statLabelSize} font-weight-bold text-uppercase`">
        {{ label }}
      </div>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { value, label } = defineProps({
  value: Number,
  label: String
})

const { mdAndUp } = useDisplay()

const statValueSize = computed(() => (mdAndUp.value ? 'h2' : 'h4'))
const statLabelSize = computed(() => (mdAndUp.value ? 'subtitle-1' : 'subtitle-1'))
</script>
