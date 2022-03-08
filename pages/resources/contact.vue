<template>
  <div>
    <page-title>{{ title }}</page-title>

    <!-- <page-section-title>Contact Us</page-section-title> -->

    For private comments/discussions and how organizations can get involved in the effort, please email <a href="mailto:atlas@mitre.org?cc=ram.shankar@microsoft.com">atlas@mitre.org and CC ram.shankar@microsoft.com</a>.
    <br><br>
    For {{ mitreTitle }} matrix and website feedback, please see the <NuxtLink to="/resources/contribute">Contribute</NuxtLink> page.
    <br><br>

    <page-section-title>Mailing List</page-section-title>

    <p>
    For discussions around {{ shortName }}, we invite everyone to join our <a href="https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ">Slack</a>, <a href="https://github.com/mitre-atlas">GitHub</a>, and or <a href="https://groups.google.com/forum/#!forum/advmlthreatmatrix/join">Google</a> groups.
    </p>

    <v-btn
        class="ma-2 white--text pa-6"
        color="#006400"
        light
        href = 'https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ'
      >
        <img
          src="../../assets/slack-icon.png"
          height="45px"
          width="45px"
          style="margin-right: 10px"
          />
        Join the Mitre-Atlas Slack
    </v-btn>

    <br><br>

    <v-btn
        class="ma-2 white--text pa-6"
        color="#6e5494"
        light
        href = 'https://github.com/mitre-atlas'
      >
        <img
          src="../../assets/github-icon.png"
          height="45px"
          width="45px"
          style="margin-right: 10px"
          />
        Join the GitHub Group
    </v-btn>

    <br></br>

    <v-btn
        class="ma-2 black--text pa-6"
        color="#D3D3D3"
        light
        href = 'https://groups.google.com/forum/#!forum/advmlthreatmatrix/join'
      >
        <img
          src="../../assets/google-group-icon.png"
          height="45px"
          width="45px"
          style="margin-right: 10px"
          />
        Join the Google Group
    </v-btn>

    <br><br>

     For general questions/comments/discussion, our public email group is <a href="mailto:advmlthreatmatrix-core@googlegroups.com">advmlthreatmatrix-core@googlegroups.com</a>. This emails all the members of the distribution group.
    <br><br>

    <v-alert text type="info">
    Google Groups generally defaults to your personal email. If you would rather access this forum using your corporate email, create a Google account using your corporate email before joining the group.
    Additionally, make sure to check if emails from Google Groups are being routed into your "Other"/"Spam"/"Forums" folder instead of your primary inbox.
    </v-alert>
  </div>
</template>
<script>
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    title: 'Contact Us',
    mitreTitle: name.mitre
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }

}
</script>
