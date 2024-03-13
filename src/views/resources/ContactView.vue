<template>
  <div>
    <PageSectionTitle :pageTitle="title" />
    <p class="my-5">
      Join our collaborative community to shape future tool and framework developments in AI
      security, threat mitigation, bias, privacy and other critical aspects of AI assurance.
    </p>

    <!-- Rows of contact cards -->
    <div v-if="smAndUp">
      <v-row class="pt-3">
        <v-col v-for="item in contacts" :key="item.icon" cols="12" md="6" xl="4">
          <ContactCard :item="item" />
        </v-col>
      </v-row>

      <div class="text-h5 pt-8 mb-3">Other ways to engage</div>

      <v-row class="pt-3">
        <v-col v-for="item in engages" :key="item.icon" cols="12" md="6" xl="4">
          <ContactCard :item="item" />
        </v-col>
      </v-row>
    </div>

    <!-- Mobile view (xs) of buttons -->
    <div v-for="item in allItems" :key="item.title" v-else>
      <v-tooltip location="bottom" :text="item.text">
        <template v-slot:activator="{ props }">
          <!-- Buttons that span the entire width but their content is left-aligned -->
          <v-btn
            v-bind="props"
            :href="item.link"
            variant="flat"
            size="large"
            block
            style="justify-content: unset"
          >
            <template v-slot:prepend>
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
            </template>
            <span class="text-none font-weight-bold">
              {{ item.title }}
            </span>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script setup>
import ContactCard from '@/components/ContactCard.vue'
import PageSectionTitle from '@//components/PageSectionTitle.vue'

const { VITE_CONTACT_EMAIL } = import.meta.env
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

// mobile boolean for contitional rendering
const { smAndUp } = useDisplay()

// Set the title of the page (for tab title and to be displayed at the top of the page)
const title = ref('Contact Us')

const contacts = [
  {
    icon: 'mdi-email',
    color: 'indigo-darken-2',
    title: `Email ${VITE_CONTACT_EMAIL}`,
    text: 'Contact us for private discussions and organization involvement',
    link: `mailto:${VITE_CONTACT_EMAIL}`
  },
  {
    icon: 'mdi-linkedin',
    color: '#0077B5',
    title: 'ATLAS on LinkedIn',
    text: 'Follow us on LinkedIn',
    link: 'https://www.linkedin.com/showcase/mitre-atlas/'
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
    icon: 'mdi-calendar',
    color: 'blue-grey',
    title: 'Events',
    text: 'Join us at an upcoming event',
    link: '/resources/events'
  },
  {
    icon: 'mdi-lightbulb',
    color: 'yellow-darken-3',
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
    text: 'View demos and walkthroughs on YouTube',
    link: 'https://youtube.com/playlist?list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu'
  }
]

const allItems = computed(() => {
  return contacts.concat(engages)
})
</script>
