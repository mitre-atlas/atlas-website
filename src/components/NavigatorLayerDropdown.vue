<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        color="inherit"
        v-bind="props"
        append-icon="mdi-menu-down"
      >
        <template v-slot:prepend>
          <img width="35" height="35" class="mr-3 ml-0" src="@/assets/nav-layer-icon.png" />
        </template>
        Navigator Layer
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(option, index) in options"
        :key="index"
        :value="index"
        :title="option.title"
        @click="option.function"
      >
      <template v-slot:prepend>
        <v-icon :icon="option.icon" size="small" style="margin-right: -18px;" />
      </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
  import { computed } from 'vue' 
  import { downloadUrlAsFile } from '@/assets/tools.js'

  const { study } = defineProps([
      /**
       * Data object type (e.g. tactics)
       * @type {Object}
       */
      'study',
    ]);

  const individualCaseStudy = JSON.parse(import.meta.env.VITE_INDIVIDUAL_CASE_STUDY)

  const rawJsonURL = computed(() => {
    return individualCaseStudy.raw_link + study.id + individualCaseStudy.suffix
  })

  const navigatorURL = computed(() => {
    return individualCaseStudy.navigator_link + rawJsonURL.value
  })

  const options = [
    { 
      title: 'View on ATLAS Navigator', 
      icon: 'mdi-open-in-new',
      function: () => window.open(navigatorURL.value, '_blank')

    },
    { title: 'Download as raw data (.json)', 
      icon: 'mdi-arrow-collapse-down', 
      function: () => downloadUrlAsFile(rawJsonURL.value)
    },
  ]


</script>