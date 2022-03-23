<template>
  <div>
    <page-title>{{ title }}</page-title>

    <page-section-title>Instructional Videos</page-section-title>

    The MITRE YouTube channel houses a <a target="_blank" href="https://youtube.com/playlist?list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu">video playlist</a> containing a collection of instructional videos for users of the {{ mitreTitle }} site.
    <br><br>
    <p>
      Videos included:
    </p>
    <ul>
      <li><a target="_blank" href="https://www.youtube.com/watch?v=3FN9v-y-C-w&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=1">{{ mitreTitle }} Website Overview</a></li>
      <li><a target="_blank" href="https://www.youtube.com/watch?v=Np_ip14YJGg&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=2">Case Study Builder Walkthrough</a></li>
    </ul>

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

    <page-section-title>Current Version</page-section-title>
    <nuxt-content :document="currentUpdatePageData" />
  </div>
</template>
<script>
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
  }

}
</script>
