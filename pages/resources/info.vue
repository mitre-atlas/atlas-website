<template>
<div>
  <page-title>{{ title }}</page-title>

  <!--
    <page-section-title>Announcements</page-section-title>
    <annoucement />
  -->

  <page-section-title>Data</page-section-title>

  The tactics and techniques referenced in {{ mitreTitle }} are drawn from:
  <ul>
    <!-- <a :href="$config.advml.repo_url">Adversarial machine learning</a> -->
    <li>Adversarial Machine Learning v{{ $config.advml.version }}</li>
    <li><a :href="$config.attack.repo_url">MITRE ATT&CK<sup>&reg;</sup> Enterprise</a> v{{ $config.attack.version }}</li>
  </ul>

  <br />

  <p>
    The first iteration of the adversarial machine learning threat matrix is at <a href="https://github.com/mitre/advmlthreatmatrix">https://github.com/mitre/advmlthreatmatrix</a>.
  </p>

  <page-section-title>Current Version: {{version}}</page-section-title>
  <ul>
    <li>This version contains changes to case studies X and Y</li>
  </ul>

  <!-- <version-documentation :version-doc="version-docA" /> -->
  <nuxt-content :document ="page"/>

</div>
</template>
<script>
import packageData from '../../package.json'
export default {
  async asyncData ({ $content }) {
    const page = await $content('version-documentation').fetch()

    return {
      page
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
  }

}
</script>
