<template>
  <v-footer padless dark>
    <v-card class="pt-2" flat tile width="100%" color="grey darken-3"><!-- MTIRE Navy #0D2F4F -->

    <v-row justify="center" align="center">
      <v-col cols="auto" :class="mobile ? 'pb-0 mb-n2' : ''"> <!--  v-show="!mobile" :class="'pb-0 mb-n2' ? mobile : ''-->
        <a href="https://www.mitre.org/">
          <img src="~/assets/mitre-logo-white.svg" :height="!mobile ? 45 : 25" class="d-block mx-auto" />
        </a>
      </v-col>

      <!-- <v-row justify="space-between" align="center" class="pb-3 pt-0">
          <v-card-text class="text-center pt-0"> -->

      <v-col cols="auto">
        <v-row justify="space-between" align="center">
          <v-card-text style="color: #bababa;" :class="`text-center text-white-50 ${mobile ? 'pb-6' : 'pt-5'}`">
            MITRE ATT&CK is a registered trademark of The MITRE Corporation.
          </v-card-text>
        </v-row>

        <v-row :class="`mt-n5 text-center ${mobile ? 'flex-column' : ''}`" justify="center">
          <!-- <v-spacer /> -->
          <v-col :key="button.text" v-for="button in mainButtons" :class="buttonClass" cols="auto">
            <v-btn
            :outlined="button.outline"
            v-text="button.text"
            text
            nuxt
            :to="button.to" /></v-col>
        </v-row>
      </v-col>

      <v-col cols="auto">
        <v-row class="text-center" justify="center" align="center"><v-col class="text-center" :key="button.text" v-for="button in importantButtons" :class="buttonClass" cols="auto">
          <v-btn
          class="mx-auto"
          color="indigo darken-1"
          depressed
          v-text="button.text"
          nuxt
          :to="button.to" /></v-col></v-row>
      </v-col>

    </v-row>

    </v-card>
  </v-footer>
</template>
<script>
export default {
  name: 'Footer',
  data: () => ({
    buttons: [
      { text: 'Contact', to: '/resources/feedback', important: true },
      { text: 'Privacy Policy', to: '/resources/privacy-policy' },
      { text: 'Terms of Use', to: '/resources/terms' }
    ]
  }),
  computed: {
    mobile () { return ['xs'].includes(this.$vuetify.breakpoint.name) },
    buttonClass () { return this.mobile ? 'px-1 py-1' : 'px-1' },
    mainButtons () { return this.buttons.filter(function (button) { return !button.important }) },
    importantButtons () { return this.buttons.filter(function (button) { return button.important }) }

  }
}
</script>
