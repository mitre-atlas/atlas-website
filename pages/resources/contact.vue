<template>
  <div>
    <page-title>{{ title }}</page-title>

    <!-- <page-section-title>Contact Us</page-section-title> -->

    For private comments/discussions and how organizations can get involved in the effort, please email:
    <br><br>

    <contact-button :color="basicButtonColor" :icon="emailIcon" :buttonText="emailButtonText" :link="emailLink"></contact-button>

    <br><br>
    For {{ mitreTitle }} matrix and website feedback, please see the <NuxtLink to="/resources/contribute">Contribute</NuxtLink> page.
    <br><br>

    <contact-button :color="basicButtonColor" :icon="contributeIcon" :buttonText="contributeButtonText" :link="contributeLink"></contact-button>

    <page-section-title>More Ways to Connect with MITRE ATLAS</page-section-title>

    <p>
    For discussions around {{ shortName }}, we invite everyone to join our <a href="https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ">Slack</a>, <a href="https://github.com/mitre-atlas">GitHub</a>, and or <a href="https://groups.google.com/forum/#!forum/advmlthreatmatrix/join">Google</a> groups. You can also find instructional demonstration videos on <a href="https://www.youtube.com/user/mitrecorp">MITRE's YouTube channel</a>.
    </p>

    <contact-button :color="slackButtonColor" :icon="slackIcon" :buttonText="slackButtonText" :link="slackLink"></contact-button>

    <br><br>

    <contact-button :color="githubButtonColor" :icon="githubIcon" :buttonText="githubButtonText" :link="githubLink"></contact-button>

    <br><br>

    <contact-button :color="youtubeButtonColor" :icon="youtubeIcon" :buttonText="youtubeButtonText" :link="youtubeLink"></contact-button>

  </div>
</template>
<script>
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    title: 'Contact Us',
    mitreTitle: name.mitre,

    basicButtonColor: '#005B94',
    slackButtonColor: '#006400',
    githubButtonColor: '#6e5494',
    youtubeButtonColor: 'red',

    emailLink: 'mailto:atlas@mitre.org',
    emailIcon: 'mdi-email',
    emailButtonText: 'atlas@mitre.org',

    contributeLink: '/resources/contribute',
    contributeIcon: 'mdi-lightbulb',
    contributeButtonText: 'Contribute',

    slackLink: 'https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ',
    slackIcon: 'mdi-slack',
    slackButtonText: 'Join the MITRE-ATLAS Slack',

    githubLink: 'https://github.com/mitre-atlas',
    githubIcon: 'mdi-github',
    githubButtonText: 'Join the GitHub Group',

    youtubeLink: 'https://youtube.com/playlist?list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu',
    youtubeIcon: 'mdi-youtube',
    youtubeButtonText: 'MITRE-ATLAS Video Playlist'
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }

}
</script>
