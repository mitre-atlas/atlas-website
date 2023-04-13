<template>
  <v-banner
    v-model="doShowAnnoucementBanner"
    app
    single-line
    color="grey lighten-4"
  >
    <v-icon slot="icon" color="info">
      mdi-security
    </v-icon>
    Draft of ATLAS mitigations are
    <nuxt-link to="/mitigations">
      now available
    </nuxt-link>
    - feedback welcome!
    <template #actions>
      <v-btn text color="primary" @click="dismissAnnoucementBanner">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-banner>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AnnouncementBanner',
  computed: {
    ...mapGetters(['doShowAnnoucementBanner'])
  },
  methods: {
    ...mapMutations({ dismissAnnoucementBanner: 'DISMISS_ANNOUCEMENT_BANNER' })
  }
}
</script>
