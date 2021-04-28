<template>
  <div>
    <page-title>Contribution</page-title>

    The Adversarial ML Threat Matrix is a first-cut attempt at collating a knowledge base of how ML systems can be attacked. We need your help to make it holistic and fill in the missing gaps!

    <page-section-title>Corrections and Improvement</page-section-title>

    For immediate corrections to tactics, techniques, and case studies, please submit a pull request to <span class="pink--text">TODO link to GitHub data repository here.</span>
    <br><br>
    For a more hands-on feedback session, <span class="pink--text">TODO future events, consider adding an announcements section.</span>

    <page-section-title>Contribute Case Studies</page-section-title>

    <p>We are especially excited for new case-studies! We look forward to contributions from both industry and academic researchers. Before submitting a case-study, consider that the attack:</p>

    <ol>
      <li>Exploits one or more vulnerabilities that compromises the confidentiality, integrity or availability of ML system.</li>
      <li>The attack was against a production, commercial ML system. This can be on MLaaS like Amazon, Microsoft Azure, Google Cloud AI, IBM Watson etc or ML systems embedded in client/edge.</li>
      <li>You have permission to share the information/published this research. Please follow the proper channels before reporting a new attack and make sure you are practicing responsible disclosure.</li>
    </ol>

    <br>

    You can email <a href="mailto:advmlthreatmatrix-core@googlegroups.com">advmlthreatmatrix-core@googlegroups.com</a> with summary of the incident and Adversarial ML Threat Matrix mapping.
    <span class="pink--text">TODO Consider adding content format examples like <a href="https://attack.mitre.org/resources/contribute/">ATT&CK's</a>.</span>

    <page-section-title>Contributors</page-section-title>

    <p>
      Thank you to our many active contributors! Including, but not limited to:
    </p>

    <v-row>
      <v-col>
        <contributors-list :contributors="contributorsA" />
      </v-col>
      <v-col>
        <contributors-list :contributors="contributorsB" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const contents = await $content('contributorslist').only('data').fetch()
    // console.log(contents.data)

    // Sort contributors alphabetically
    const contributors = contents.data.map((c) => {
      c.contributors.sort()
      return c
    })

    // Sort by organization name
    contributors.sort((a, b) => (a.organization > b.organization) ? 1 : ((a.organization < b.organization) ? -1 : 0))

    // Split into two columns
    const splitIndex = contributors.length / 2
    const contributorsA = contributors.splice(0, splitIndex)
    const contributorsB = contributors.splice(-splitIndex)

    return { contributorsA, contributorsB }
  }
}
</script>
