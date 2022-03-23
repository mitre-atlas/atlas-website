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

    <upcoming-events :events="events" class="pt-5" />
  </div>
</template>
<script>
/* eslint-disable */
export default {
  async asyncData ({ $content }) {
    let events = await $content('upcoming-events').sortBy('date').fetch()

    events = events.map((event) => {
      event.date = new Date(event.date).toLocaleDateString(
        'default',
        { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
      )
      return event
    })

    return {
      events
    }
  },
  data: ({ $config: { name, contact_email } }) => ({
    shortName: name.short,
    title: 'Contact Us',
    mitreTitle: name.mitre,

    contacts: [
      {
        icon: 'mdi-email',
        color: '#005B94',
        title: `Email ${contact_email}`,
        text: 'Contact us for private discussions and organization involvement',
        link: `mailto:${contact_email}`
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
