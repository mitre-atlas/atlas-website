<template>
  <div>
    <page-title>{{ title }}</page-title>
    <p>
      Join our collaborative community to shape future tool and framework developments in AI security, threat mitigation, bias, privacy and other critical aspects of AI assurance.
    </p>

    <v-row>
      <v-col
        v-for="item in contacts"
        :key="item.icon"
        cols="12"
        sm="6"
      >
        <contact-card :item="item" />
      </v-col>
    </v-row>

    <page-section-title class="pt-5">
      Other ways to engage
    </page-section-title>

    <v-row>
      <v-col
        v-for="item in engages"
        :key="item.icon"
        cols="12"
        sm="6"
      >
        <contact-card :item="item" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    title: 'Contact Us',
    mitreTitle: name.mitre,

    contacts: [
      {
        icon: 'mdi-email',
        color: '#005B94',
        title: 'Email atlas@mitre.org',
        text: 'Contact us for private discussions and organization involvement',
        link: 'mailto:atlas@mitre.org'
      },
      {
        icon: 'mdi-slack',
        color: 'green darken-3',
        title: 'mitre-atlas Slack',
        text: 'Join the Slack workspace for discussions with the broader community',
        link: 'https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ'
      }
    ],
    engages: [
      {
        icon: 'mdi-lightbulb',
        color: '#c7880a',
        title: 'Contribute',
        text: 'Find out how to contribute to the ATLAS framework',
        link: '/resources/contribute'
      },
      {
        icon: 'mdi-github',
        color: '#6e5494',
        title: 'mitre-atlas GitHub',
        text: 'See data and tools at the mitre-atlas GitHub group',
        link: 'https://github.com/mitre-atlas'
      },
      {
        icon: 'mdi-youtube',
        color: 'red darken-2',
        title: 'ATLAS Video Playlist',
        text: 'See demos and walkthroughs on YouTube',
        link: 'https://youtube.com/playlist?list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu'
      }
    ]
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }

}
</script>
