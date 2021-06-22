<template>
<div>
  <page-title>General information</page-title>

  <page-section-title>Announcements</page-section-title>

  <annoucement />

  <page-section-title>Data</page-section-title>

  The tactics and techniques referenced in MITRE {{ $config.name.short }} are drawn from:
  <ul>
    <!-- <a :href="$config.advml.repo_url">Adversarial machine learning</a> -->
    <li>Adversarial Machine Learning v{{ $config.advml.version }}</li>
    <li><a :href="$config.attack.repo_url">MITRE ATT&CK<sup>&reg;</sup> Enterprise</a> v{{ $config.attack.version }}</li>
  </ul>

  <br />

  <p>
    The first iteration of the adversarial machine learning threat matrix is at <a href="https://github.com/mitre/advmlthreatmatrix">https://github.com/mitre/advmlthreatmatrix</a>.
  </p>

</div>
</template>
<script>
export default {
  data: () => ({
  })
}
</script>
