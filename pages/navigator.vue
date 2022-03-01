<template>
  <div>
    <page-title>{{ title }}</page-title>

    <p>
      To view {{ mitreTitle }} data alongside MITRE ATT&CK<sup>&reg;</sup> Enterprise tactics and techniques, visit the {{ shortName }} customized version of the ATT&CK Navigator. It can be viewed on another page via the link below, or in the window further down this page.
    </p>

    <p>
      <v-card-actions class="justify-center">
        <v-btn target="_blank" :href="$config.navigator_url">
          {{ title }}
        </v-btn>
      </v-card-actions>
    </p>

    <p>
      This customized Navigator encodes the ATLAS techniques as an additional platform in ATT&CK, and allows users to create complex visualizations containing both machine learning and enterprise techniques. For more information on the standard ATT&CK Navigator and how to use it, visit the <a target="_blank" href="https://github.com/mitre-attack/attack-navigator">project's GitHub page here</a> as well as watch a short <a target="_blank" href="https://www.youtube.com/watch?v=pcclNdwG8Vs.">demo video on YouTube</a>.
    </p>

    <div style="text-align: center;">
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
