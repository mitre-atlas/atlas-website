<template>
  <div>
    <page-title>{{ title }}</page-title>

    {{ mitreTitle }} is a first-cut attempt at collating a knowledge base of how ML systems can be attacked. We need your help to make it holistic and fill in the missing gaps!

    <page-section-title>Corrections and Improvement</page-section-title>

    For immediate corrections to tactics, techniques, and case studies, please email <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
    <br><br>
    <!-- For a more hands-on feedback session, <span class="pink--text">TODO future events, consider adding an announcements section.</span> -->

    <page-section-title>Contribute Case Studies</page-section-title>

    <p>We are especially excited for new case-studies! We look forward to contributions from both industry and academic researchers. Before submitting a case-study, consider that the attack:</p>

    <ol>
      <li>Exploits one or more vulnerabilities that compromises the confidentiality, integrity or availability of ML system.</li>
      <li>The attack was against a production, commercial ML system. This can be on MLaaS like Amazon, Microsoft Azure, Google Cloud AI, IBM Watson, or ML systems embedded in client/edge.</li>
      <li>You have permission to share the information/published this research. Please follow the proper channels before reporting a new attack and make sure you are practicing responsible disclosure.</li>
    </ol>

    <br>

    If the case study passes all three requirements, the <NuxtLink to="/studies/create">Build Case Study</NuxtLink> page can be used to construct the case study for submission.
    In cases where a .yaml file already exists, the case study form accepts .yaml uploads for editing. Otherwise, the form should be populated with as much detail as possible, including meta-data and a list of the procedures used in the case study. Optionally, references can be added to support the case study.
    Finally the case study should be shared with the {{ $config.name.short }} team by downloading the created .yaml file and emailing it to <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
    See an example of the format below.

    <br><br>

    <div class="center">
      <video controls src="/atlas_case_study_demo.mp4" />
    </div>

    <page-section-title>Case study example</page-section-title>
    <case-study-example />

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
  },
  data: ({ $config: { name } }) => ({
    mitreTitle: name.mitre,
    title: 'Contribute'
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }
}
</script>

<style scoped>
video{
  margin-left: auto;
  margin-right: auto;
  max-height: 550px;
}
div.center {
  text-align: center;
}
</style>
