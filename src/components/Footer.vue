<template>
  <v-footer class="pa-0" app :absolute="!display.mobile">
    <v-card class="pa-3 rounded-0" width="100%" color="navy">
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" sm="2" :class="mobile ? 'pb-0 mb-n2' : ''">
          <a href="https://www.mitre.org" target="_blank">
            <img
              src="../assets/mitre-logo-white.svg"
              :height="!mobile ? 45 : 25"
              class="d-block mx-auto"
            />
          </a>
        </v-col>

        <v-col cols="12" sm="8">
          <v-row justify="space-between" align="center">
            <v-card-text
              :class="`text-center white--text ${mobile ? 'pb-6' : 'pt-5'}`"
            >
              MITRE ATLAS&trade; and MITRE ATT&CK<sup>&reg;</sup> are a
              trademark and registered trademark of The MITRE Corporation.
            </v-card-text>
          </v-row>

          <v-row
            :class="`mt-n5 text-center ${mobile ? 'flex-row' : ''}`"
            justify="center"
          >
            <v-col
              :class="buttonClass"
              cols="auto"
            >
              <!-- External link -->
              <v-btn
                text
                elevation="0"
                color="navy"
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
                depressed
                elevation="0"
                color="navy"
                to="/terms"
              >
                Terms of Use
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
                elevation="0"
                color="blue"
                depressed
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

<script setup>
import { useDisplay } from "vuetify";
import { computed } from 'vue' 

const display = useDisplay();

const mobile = computed(() => {
  return display.mobile.value;
});
const buttonClass = computed(() => {
  return mobile.value ? "px-1 py-1" : "px-1";
});
const mainButtons = computed(() => {
  return buttons.filter(function (button) {
    return !button.important;
  });
});
const importantButtons = computed(() => {
  return buttons.filter(function (button) {
    return button.important;
  });
});
</script>
