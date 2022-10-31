<template>
  <div>
    <page-title>{{ title }}</page-title>

    {{ mitreTitle }} is a first-cut attempt at collating a knowledge base of how ML systems can be attacked. We need your help to make it holistic and fill in the missing gaps!

    <page-section-title class="pt-5">Corrections and Improvement</page-section-title>

    For immediate corrections to tactics, techniques, and case studies, please email <a href="mailto:atlas@mitre.org">atlas@mitre.org</a> or <a href="https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ" target="_blank">join MITRE ATLAS on Slack</a> and post on the <a href="https://slack.com/app_redirect?team=T02RY3VGBPS&channel=C03745F7LDQ" target="_blank">#feedback-and-recommendations</a> channel.

    <page-section-title class="pt-5">Contribute Case Studies</page-section-title>

    <p>We are especially excited for new case-studies! We look forward to contributions from both industry and academic researchers.</p>

    <p>
      Use the Case Study Builder
      to craft a submission file with details and technique mappings,
      then email the file to <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
      The {{ $config.name.short }} team will review the submission and follow up with feedback.
    </p>

    <p>
      <v-card-actions>
        <v-btn nuxt to="/studies/create">
          Go to the case study builder
        </v-btn>
      </v-card-actions>
    </p>

    <page-section-title class="pt-5">Contributors</page-section-title>

    <p>
      Thank you to our many active contributors! Including, but not limited to:
    </p>

    <v-row v-if="!$vuetify.breakpoint.mobile">
      <v-col>
        <contributors-list :contributors="contributorsA" />
      </v-col>
      <v-col>
        <contributors-list :contributors="contributorsB" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <contributors-list :contributors="contributors" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const contents = await $content('contributorslist').only('data').fetch()

    // Sort contributors alphabetically
    const contributors = contents.data.map((c) => {
      c.contributors.sort()
      return c
    })

    // Sort by organization name
    contributors.sort((a, b) => (a.organization > b.organization) ? 1 : ((a.organization < b.organization) ? -1 : 0))

    // Split into two columns
    const splitIndex = Math.ceil(contributors.length / 2)
    const contributorsA = contributors.slice().splice(0, splitIndex)
    const contributorsB = contributors.slice().splice(splitIndex, contributors.length)

    return { contributors, contributorsA, contributorsB }
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
