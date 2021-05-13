<template>
<div>
  <page-title>General information</page-title>

  <page-section-title>Data</page-section-title>

  The tactics and techniques referenced in {{ $config.name.short }}:
  <ul>
    <li><a :href="$config.advml.repo_url">Adversarial machine learning</a>: v{{ $config.advml.version }}</li>
    <li><a :href="$config.attack.repo_url">ATT&CK Enterprise</a>: v{{ $config.attack.version }}</li>
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
