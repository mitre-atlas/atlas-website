<template>
    <div>
        <div class="text-h3">
            {{ title }}
        </div>

        <p class="text-body-1 my-5">
            Join our collaborative community to shape future tool and framework developments in AI security, threat mitigation, bias, privacy and other critical aspects of AI assurance.
        </p>

        <v-row class="pt-3">
            <v-col
                v-for="item in contacts"
                :key="item.icon"
                cols="12"
                sm="6"
            >
                <ContactCard :item="item" />
            </v-col>
        </v-row>

        <div class="text-h5 pt-8">
          Other ways to engage
        </div>

        <v-row class="pt-3">
          <v-col
            v-for="item in engages"
            :key="item.icon"
            cols="12"
            sm="6"
          >
            <ContactCard :item="item" />
          </v-col>
        </v-row>

    </div>
</template>
  
<script setup>
  import ContactCard from '@/components/ContactCard.vue';

  const { VITE_CONTACT_EMAIL } = import.meta.env 
  import { ref } from 'vue'

  // Set the title of the page (for tab title and to be displayed at the top of the page)
  const title = ref('Contact Us')

  const contacts = [
    {
      icon: 'mdi-email',
      color: '#005B94',
      title: `Email ${VITE_CONTACT_EMAIL}`,
      text: 'Contact us for private discussions and organization involvement',
      link: `mailto:${VITE_CONTACT_EMAIL}`
    },
    {
      icon: 'mdi-slack',
      color: 'green-darken-3',
      title: 'MITRE | ATLAS Slack',
      text: 'Join the Slack workspace for discussions with the broader community',
      link: 'https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ'
    }
  ]
  const engages = [
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
      color: 'red-darken-2',
      title: 'ATLAS Video Playlist',
      text: 'See demos and walkthroughs on YouTube',
      link: 'https://youtube.com/playlist?list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu'
    },
    {
      icon: 'mdi-linkedin',
      color: '#0077B5',
      title: 'ATLAS on LinkedIn',
      text: 'Follow us on LinkedIn',
      link: 'https://www.linkedin.com/showcase/mitre-atlas/'
    }
  ]

</script>