<template>
  <div>
    <page-title>{{ title }}</page-title>

    <h2>General</h2>
    <hr class="solid">
    <br>

    <nuxt-content :document="generalFaq[0]" />
    <p></p>
    <p class="pl-6">  Techniques describe the means by which adversaries achieve tactical goals. They represent “how” an adversary achieves a tactical objective by performing an action.
    For example, an adversary may gain initial access by compromising the machine learning (ML) supply chain. Techniques may also represent “what” an adversary gains by performing an action. This is a useful distinction for the ML Attack Staging tactic,
    where the adversary is typically creating or modifying an ML artifact that will be used in a subsequent tactical objective.
    There can be multiple techniques in each tactic category as there are many ways to achieve tactical objectives.
    <sup><a href="https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf">[1]</a></sup></p>

    <nuxt-content :document="generalFaq[1]" />
    <p></p>
    <p class="pl-6">Tactics are tactical adversary goals during an attack. They represent the “why” of a technique: the reason for performing an action.
    Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation.
    <sup><a href="https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf">[2]</a></sup> MITRE ATLAS<sup>&trade;</sup> tactics represent new adversary goals particular to machine learning systems, as well as tactics adapted from the MITRE ATT&CK<sup>&reg;</sup> Enterprise Matrix.
    In those cases, ATT&CK tactic definitions are stretched to include ML concepts.
    </p>

    <nuxt-content :document="generalFaq[2]" />
    <p></p>
    <p class="pl-6">The MITRE ATLAS™ version of the ATT&CK Navigator displays ATLAS techniques and allows users to create and view complex visualizations. In addition to the matrix, the Navigator also shows a frequency heat map of techniques used in ATLAS case studies.</p>

    <h2>Case Study Terminology</h2>
    <hr class="solid">
    <br>

    <nuxt-content :document="caseStudyTerminologyFaq[0]" />
    <p></p>
    <p class="pl-6">{{ caseStudyLegend['legend']['incident_date']['description'] }}</p>

    <nuxt-content :document="caseStudyTerminologyFaq[1]" />
    <p></p>
    <p class="pl-6">{{ caseStudyLegend['legend']['actor']['description'] }}</p>

    <nuxt-content :document="caseStudyTerminologyFaq[2]" />
    <p></p>
    <p class="pl-6">{{ caseStudyLegend['legend']['reporter']['description'] }}</p>

    <nuxt-content :document="caseStudyTerminologyFaq[3]" />
    <p></p>
    <p class="pl-6">{{ caseStudyLegend['legend']['target']['description'] }}</p>

    <nuxt-content :document="caseStudyTerminologyFaq[4]" />
    <p></p>
    <p class="pl-6">{{ caseStudyLegend['legend']['case_study_type']['description'] }}</p>

    <h2>Staying Informed</h2>
    <hr class="solid">
    <br>

    <nuxt-content :document="stayingInformedFaq[0]" />
    <p></p>
    <p class="pl-6">Keep up to date using the resources in our <a href="https://atlas.mitre.org/resources/contact">contact page.</a></p>

  </div>
</template>

<script>
import packageData from '../../package.json'
export default {
  async asyncData ({ $content }) {
    const faqPage = await $content('faq-page').fetch()
    const generalFaq = await $content('faq-files/general-faq').sortBy('slug', 'asc').fetch()
    const caseStudyTerminologyFaq = await $content('faq-files/case-study-terminology-faq').sortBy('slug', 'asc').fetch()
    const stayingInformedFaq = await $content('faq-files/staying-informed-faq').sortBy('slug', 'asc').fetch()
    const caseStudyLegend = await $content('case-study-legend').fetch()
    return {
      faqPage, generalFaq, caseStudyTerminologyFaq, stayingInformedFaq, caseStudyLegend
    }
  },
  data: ({ $config: { name } }) => ({
    version: packageData.version,
    mitreTitle: name.mitre,
    shortName: name.short,
    title: 'FAQ'
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }

}
</script>
