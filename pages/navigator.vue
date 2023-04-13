<template>
  <div>
    <page-title>{{ title }}</page-title>

    <p class="tw-prose tw-max-w-none">
      The {{ mitreTitle }} version of the ATT&CK Navigator displays
      {{ shortName }} techniques and allows users to create and view complex
      visualizations. In addition to the matrix, the Navigator also shows a
      frequency heat map of techniques used in {{ shortName }} case studies.
      View the {{ shortName }} Navigator below or at
      <a
        :href="$config.navigator_url"
        target="_blank"
      >{{ $config.navigator_url }}<v-icon x-small>mdi-open-in-new</v-icon></a>.
    </p>

    <p class="tw-prose tw-max-w-none">
      For more information on the standard ATT&CK Navigator and how to use it,
      visit the
      <a
        target="_blank"
        href="https://github.com/mitre-attack/attack-navigator"
      >project's GitHub page here</a>
      as well as watch a short
      <a
        target="_blank"
        href="https://www.youtube.com/watch?v=pcclNdwG8Vs."
      >demo video on YouTube</a>.
    </p>

    <div style="text-align: center">
      <iframe
        :src="`${$config.navigator_url}`"
        width="90%"
        height="700px"
        frameBorder="0"
      />
    </div>
  </div>
</template>

<script>
// ATLAS navigator page
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    title: `${name.short} Navigator`,
    mitreTitle: name.mitre
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
iframe {
  overflow: auto;
}
</style>
