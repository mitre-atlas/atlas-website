<template>
  <v-layout-item
    v-scroll="onScroll"
    class="text-end pointer-events-none"
    model-value
    position="bottom"
    size="88"
  >
    <div class="ma-4">
      <v-fab-transition>
        <v-btn
          v-show="model"
          class="mt-auto pointer-events-initial"
          color="blue"
          elevation="8"
          icon="mdi-chevron-up"
          size="large"
          @click="scrollToTop"
        />
      </v-fab-transition>
    </div>
  </v-layout-item>
</template>

<script setup>
import { shallowRef } from 'vue'

const model = shallowRef(false)

function onScroll() {
  model.value = window.scrollY > 200
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.pointer-events-none {
  pointer-events: none;
}

.pointer-events-initial {
  pointer-events: initial;
}
</style>
