<template>
  <div class="ma-1 text-center">
    <div :class="`text-h4 text-${statColor}`">
      {{ value }}
    </div>
    <div class="text-white text-caption font-weight-bold text-uppercase text-right">
      {{ label }}
    </div>
  </div>
</template>

<script setup>
const { value, label, color } = defineProps({
  value: Number,
  label: String,
  color: {
    type: String,
    default: 'lightBlue'
  }
})

const statColor = color
</script>
