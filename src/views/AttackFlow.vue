<template>
  <div>
    <PageSectionTitle :pageTitle="title" />

    <p>
    ATLAS is now available in <a href="https://center-for-threat-informed-defense.github.io/attack-flow/">Attack Flow</a>!
    You can now use the 
    <a hred="https://center-for-threat-informed-defense.github.io/attack-flow/ui/">Attack Flow Builder</a>
    to build Flows using ATLAS TTPs.
    </p>

    <p>
      The Attack Flow project helps defenders move from tracking individual adversary behaviors to tracking the sequences of behaviors that adversaries employ to move towards their goals. By looking at combinations of behaviors, defenders learn the relationships between them: how some techniques set up other techniques, or how adversaries handles uncertainty and recover from failure. The project supports a wide variety of use cases: from blue team to red team, from manual analysis to autonomous response, and from front-line worker to the C-suite. Attack Flow provides a common language and toolset for describing complex, adversarial behavior.
    </p>

    <div>
      As an example of how Attack Flow can be used to describe attacks targeting AI systems, we built a
      <a href="https://center-for-threat-informed-defense.github.io/attack-flow/ui/?src=https%3A%2F%2Fcenter-for-threat-informed-defense.github.io%2Fattack-flow%2Fcorpus%2FBlack%2520Basta%2520Ransomware.afb&readonly=1&theme=light_theme">Flow</a>
      for the 
      <a href="/studies/AML.CS0051">OpenClaw Command & Control via Prompt Injection</a>
      case study:
    </div>

    <iframe src="https://center-for-threat-informed-defense.github.io/attack-flow/ui/?src=https%3A//center-for-threat-informed-defense.github.io/attack-flow/corpus/OpenClaw.afb" width="100%" height="3600"></iframe>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageSectionTitle from '@//components/PageSectionTitle.vue'

const { VITE_MITRE_TITLE, VITE_SHORT_NAME, VITE_KNOWLEDGE_GRAPH_URL } = import.meta.env
const title = ref(VITE_SHORT_NAME + ' in Attack Flow')

const loading = ref(true)
</script>
