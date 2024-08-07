<template>
  <p>
    Attacks on machine learning (ML) systems are being developed and released with increased
    regularity. Attacks have historically been performed in controlled settings, but attacks are
    increasingly observed on production systems. Deployed AI systems can have many vulnerabilities,
    for example trained on personally identifiable information, trusted to make critical decisions
    with little oversight, and have little to no logging and alerting attached to their use.
  </p>
  <p>
    {{ VITE_MITRE_TITLE }} case studies are selected because of the impact to production AI systems.
    Each demonstrates one of the following characteristics:
  </p>
  <ol class="pl-4 pb-4" style="line-height: 2.5">
    <li>
      Range of Attacks: Evasion, poisoning, model replication and exploiting traditional software
      flaws.
    </li>
    <li>
      Range of Personas: Average user, security researchers, ML researchers and fully-equipped Red
      team.
    </li>
    <li>
      Range of ML Paradigms: Attacks on MLaaS, ML models hosted on cloud, hosted on-premise, ML
      models on edge.
    </li>
    <li>
      Range of Use Case: Attacks on AI systems used in both "security-sensitive" applications like
      cybersecurity and non-security-sensitive applications like chatbots.
    </li>
  </ol>
  <p>
    View a heat map of techniques used in these case studies on the
    <a target="_blank" :href="frequencyNavigatorUrl">ATLAS Navigator</a>.
  </p>
</template>

<script setup>
const { VITE_MITRE_TITLE } = import.meta.env
import { constructNavigatorLayerGitHubUrl, constructNavigatorUrlToLayer } from '@/assets/tools.js'
// Construct link to open the case study frequency Navigator layer on the ATLAS Navigator
const frequencyLayerGitHubUrl = constructNavigatorLayerGitHubUrl(
  'atlas_case_study_frequency',
  'dist/default-navigator-layers'
)
const frequencyNavigatorUrl = constructNavigatorUrlToLayer(frequencyLayerGitHubUrl)
</script>
