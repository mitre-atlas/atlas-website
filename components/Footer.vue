<template>
  <v-footer id="footer" padless dark :app="!$vuetify.breakpoint.mobile">
    <v-card
      style="overflow: clip"
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
            <v-img
              :src="footer_logo_image"
              :height="!mobile ? 45 : 25"
              contain
            />
          </a>
        </v-col>
        <v-col cols="12" sm="8">
          <v-row justify="space-between" align="center">
            <v-card-text
              style="color: #bababa"
              :class="`text-center text-white-50 ${mobile ? 'pb-6' : 'pt-5'}`"
            >
              MITRE ATLAS&trade; and MITRE ATT&CK<sup>&reg;</sup> are a
              trademark and registered trademark of The MITRE Corporation.
            </v-card-text>
          </v-row>
          <v-row
            :class="`mt-n7 mb-2 text-center ${mobile ? 'flex-row' : ''}`"
            justify="center"
          >
            <v-col
              :class="buttonClass"
              cols="auto"
            >
              <!-- External link -->
              <v-btn
                text
                href="https://www.mitre.org/privacy-policy"
                target="_blank"
              >
                Privacy Policy
              </v-btn>
            </v-col>
            <v-col
              :class="buttonClass"
              cols="auto"
            >
              <!-- Internal link -->
              <v-btn
                text
                nuxt
                to="/resources/terms"
              >
                Terms of Use
              </v-btn>
            </v-col>
            <v-col
              class="buttonClass"
              cols="auto"
            >
              <!-- Osano cookie management popup -->
              <v-btn
                text
                @click="Osano.cm.showDrawer('osano-cm-dom-info-dialog-open')"
              >
                Manage Cookies
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="2">
          <v-row
            :class="`text-center ${mobile ? 'mb-5' : ''}`"
            justify="center"
            align="center"
          >
            <v-col
              class="text-center"
              :class="buttonClass"
              cols="auto"
            >
              <v-btn
                class="mx-auto"
                color="indigo darken-1"
                depressed
                nuxt
                to="resources/contact"
              >
                Contact
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-footer>
</template>
<script>
/**
 * Website footer, present on every page.
 * Included in the layout files.
 */
export default {
  name: 'Footer',
  data: () => ({
  }),
  computed: {
    /**
     * Returns whether or not the user is viewing on mobile
     * @returns {Boolean}
     */
    mobile () {
      return ['xs'].includes(this.$vuetify.breakpoint.name)
    },
    /**
     * Returns styling on button dependent on whether in mobile mode
     * @returns {String}
     */
    buttonClass () {
      return this.mobile ? 'px-1 py-1' : 'px-1'
    },
    /**
     * Gets the logo to put in the footer
     * @returns {String}
     */
    footer_logo_image () {
      try {
        if (
          this.$config.footer_logo_image &&
          this.$config.footer_logo_image.startsWith('http')
        ) {
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
<style>
.osano-cm-widget {
  display: none;
}
</style>
