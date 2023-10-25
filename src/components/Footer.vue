<template>
  <v-footer class="pa-0" id="footer" app :absolute="!display.mobile">
    <v-card class="rounded-0" border="0" width="100%" color="header">
      <!-- MTIRE Navy #0D2F4F -->

      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" sm="2" :class="mobile ? 'pb-0 mb-n2' : ''">
          <a href="mitre.org" target="_blank">
            <img
              src="../assets/mitre-logo-white.svg"
              :height="!mobile ? 45 : 25"
              class="d-block mx-auto"
            />
          </a>
        </v-col>

        <v-col cols="12" sm="8">
          <v-row justify="space-between" align-self="center" no-gutters>
            <v-card-text
              style="color: #bababa"
              :class="`text-center text-white-50 ${mobile ? 'pb-6' : 'pt-5'}`"
            >
              MITRE ATLAS&trade; and MITRE ATT&CK<sup>&reg;</sup> are a
              trademark and registered trademark of The MITRE Corporation.
            </v-card-text>
          </v-row>

          <v-row
            :class="`mt-n3 text-center ${mobile ? 'flex-column' : ''}`"
            justify="center"
            no-gutters
          >
            <v-col
              v-for="button in mainButtons"
              :key="button.text"
              :class="buttonClass"
              cols="auto"
            >
              <v-btn
                :outlined="button.outline"
                variant="text"
                :to="button.to"

              >{{ button.text }}</v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="2">
          <v-row :class="`text-center ${mobile ? 'mb-5' : ''}`" justify="center" align="center">
              <v-col
              v-for="button in importantButtons"
              :key="button.text"
              :class="buttonClass"
              cols="auto"
            >
              <v-btn
                class="mx-auto"
                color="indigo darken-1"
                depressed
                nuxt
                :to="button.to"

              >{{ button.text }} </v-btn>
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

const buttons = [
  { text: "Contact", to: "/resources/contact", important: true },
  { text: "Privacy Policy", to: "/resources/privacy-policy" },
  { text: "Terms of Use", to: "/resources/terms" },
];

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
