<template>
  <v-footer
    id="footer"
    padless
    dark
    :app="!$vuetify.breakpoint.mobile"
    :style="($vuetify.breakpoint.mobile) ? 'z-index: 4000;' : ''"
  >
    <v-card
      style="overflow: clip;"
      class="pt-2"
      flat
      tile
      width="100%"
      color="grey darken-3"
    >
      <!-- MTIRE Navy #0D2F4F -->

      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" sm="2" :class="mobile ? 'pb-0 mb-n2' : ''">
          <!--  v-show="!mobile" :class="'pb-0 mb-n2' ? mobile : ''-->
          <a :href="$config.footer_logo_link" target="_blank">
            <img :src="footer_logo_image" :height="!mobile ? 45 : 25" class="d-block mx-auto">
          </a>
        </v-col>

        <v-col cols="12" sm="8">
          <v-row justify="space-between" align="center">
            <v-card-text style="color: #bababa;" :class="`text-center text-white-50 ${mobile ? 'pb-6' : 'pt-5'}`">
              MITRE ATLAS&trade; and MITRE ATT&CK<sup>&reg;</sup> are a trademark and registered trademark of The MITRE Corporation.
            </v-card-text>
          </v-row>

          <v-row :class="`mt-n5 text-center ${mobile ? 'flex-column' : ''}`" justify="center">
            <v-col v-for="button in mainButtons" :key="button.text" :class="buttonClass" cols="auto">
              <v-btn
                :outlined="button.outline"
                text
                nuxt
                :to="button.to"
                v-text="button.text"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="2">
          <v-row class="text-center" justify="center" align="center">
            <v-col v-for="button in importantButtons" :key="button.text" class="text-center" :class="buttonClass" cols="auto">
              <v-btn
                class="mx-auto"
                color="indigo darken-1"
                depressed
                nuxt
                :to="button.to"
                v-text="button.text"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-row :class="`mt-n10 text-center ${mobile ? 'flex-column' : ''}`" justify="center">
          <v-card-text style="color: #bababa; margin-top:1%;" :class="`text-center text-white-50 ${mobile ? 'pb-6' : 'pt-5'}`">
            v{{ $config.site_version }}
          </v-card-text>
        </v-row>
      </v-row>
    </v-card>
  </v-footer>
</template>
<script>
export default {
  name: 'Footer',
  data: () => ({
    buttons: [
      { text: 'Contact', to: '/resources/contact', important: true },
      { text: 'Privacy Policy', to: '/resources/privacy-policy' },
      { text: 'Terms of Use', to: '/resources/terms' }
    ]
  }),
  computed: {
    mobile () { return ['xs'].includes(this.$vuetify.breakpoint.name) },
    buttonClass () { return this.mobile ? 'px-1 py-1' : 'px-1' },
    mainButtons () { return this.buttons.filter(function (button) { return !button.important }) },
    importantButtons () { return this.buttons.filter(function (button) { return button.important }) },
    footer_logo_image () {
      try {
        if (this.$config.footer_logo_image && this.$config.footer_logo_image.startsWith('http')) {
          // External URL
          return this.$config.footer_logo_image
        } else {
          // Assume path is relative to the assets directory
          return require('~/assets/' + this.$config.footer_logo_image)
        }
      } catch (e) {
        // Use default logo
        return require('~/assets/mitre-logo-white.svg')
      }
    }
  }
}
</script>
