<template>
  <div>
    <page-title>{{ title }}</page-title>

    {{ mitreTitle }} is a first-cut attempt at collating a knowledge base of how ML systems can be attacked. We need your help to make it holistic and fill in the missing gaps!

    <page-section-title>Corrections and Improvement</page-section-title>

    For immediate corrections to tactics, techniques, and case studies, please email <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
    <br><br>
    <!-- For a more hands-on feedback session, <span class="pink--text">TODO future events, consider adding an announcements section.</span> -->

    <page-section-title>Contribute Case Studies</page-section-title>

    <p>We are especially excited for new case-studies! We look forward to contributions from both industry and academic researchers.</p>

    <p>
      Use the <NuxtLink to="/studies/create">Case Study Builder</NuxtLink> to craft a submission file with details and technique mappings,
      then email the file to <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
      The {{ $config.name.short }} team will review the submission and follow up with feedback.
    </p>

    <p>
      <v-card-actions>
         <v-btn nuxt to="/studies/create">Go to the case study builder</v-btn>
      </v-card-actions>
    </p>

    <!--
    <div class="center">
      <video controls src="/atlas_case_study_demo.mp4" />
    </div>
    -->

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
