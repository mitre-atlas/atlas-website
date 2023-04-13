<template>
  <div>
    <page-title>{{ title }}</page-title>

    <v-expansion-panels flat multiple :value="indices" class="faq-panels">
      <v-expansion-panel v-for="faq in faqFilesList" :key="faq.title">
        <v-expansion-panel-header class="text-h5">
          {{ faq.title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <nuxt-content :document="faq" class="tw-prose tw-max-w-none" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const faqFilesList = await $content('faq-files')
      .sortBy('weight', 'asc')
      .fetch()

    // Indices of expansion panels to open (all)
    const indices = [...Array(faqFilesList.length).keys()]

    return {
      faqFilesList,
      indices
    }
  },
  data: () => ({
    title: 'FAQ'
  })
}
</script>

<style scoped>
/* TODO does not work to put under banner */
.faq-panels {
  z-index: unset;
}
</style>
