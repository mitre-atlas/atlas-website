<template>
  <div>

    <page-title>{{ title }}</page-title>

    <v-chip
      class="ma-1"
      color="primary"
      label
      style="float: left"
    >
      <v-icon left>
        mdi-database
      </v-icon>
      Ver. {{ getVersion }}
    </v-chip>

    <page-section-title>Data</page-section-title>

    The tactics and techniques referenced in {{ mitreTitle }} are drawn from:
    <ul>
      <li>Adversarial Machine Learning v{{ $config.advml.version }}</li>
      <li><a :href="$config.attack.repo_url">MITRE ATT&CK<sup>&reg;</sup> Enterprise</a> v{{ $config.attack.version }}</li>
    </ul>

    <br>

    <p>
      The first iteration of the adversarial machine learning threat matrix is at <a href="https://github.com/mitre/advmlthreatmatrix">https://github.com/mitre/advmlthreatmatrix</a>.
    </p>

    <v-chip
      class="ma-1"
      color="primary"
      label
      style="float: left"
    >
      <v-icon left>
        mdi-code-tags
      </v-icon>
      Ver. {{ getVersion }}
    </v-chip>

    <page-section-title>Current Version</page-section-title>
    <nuxt-content :document="currentUpdatePageData" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import packageData from '../../package.json'

export default {
  async asyncData ({ $content }) {
    const currentUpdatePage = await $content('update-files').sortBy('slug', 'desc').limit(1).fetch()
    const currentUpdatePageData = currentUpdatePage[0]
    return {
      currentUpdatePageData
    }
  },
  data: ({ $config: { name } }) => ({
    version: packageData.version,
    mitreTitle: name.mitre,
    shortName: name.short,
    title: 'General Information'
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  },
  computed: {
    ...mapGetters(['getVersion'])
  }
}
</script>
