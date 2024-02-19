<template>
  <v-footer class="pa-0" app :absolute="!mdAndUp">
    <v-card class="pa-3 rounded-0" width="100%" color="navy">
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" sm="2" :class="!mdAndUp ? 'pb-0 mb-n2' : ''">
          <a href="https://www.mitre.org" target="_blank">
            <img
              src="../assets/mitre-logo-white.svg"
              :height="mdAndUp ? 45 : 25"
              class="d-block mx-auto"
            />
          </a>
        </v-col>

        <v-col cols="12" sm="8">
          <v-row justify="space-between" align="center">
            <v-card-text
              :class="`text-center text-white ${!mdAndUp ? 'pb-6' : 'pt-5'}`"
            >
              MITRE ATLAS&trade; and MITRE ATT&CK<sup>&reg;</sup> are a
              trademark and registered trademark of The MITRE Corporation.
            </v-card-text>
          </v-row>

          <v-row
            :class="`mt-n5 text-center ${!mdAndUp ? 'flex-row' : ''}`"
            justify="center"
          >
            <v-col
              :class="`${!mdAndUp ? 'px-1 py-5' : 'px-1'}`"
              cols="auto"
            >
              <!-- External link -->
              <v-btn
                text="Privacy Policy"
                elevation="0"
                color="navy"
                href="https://www.mitre.org/privacy-policy"
                target="_blank"
              />
            </v-col>
            <v-col
              :class="`${!mdAndUp ? 'px-1 py-5' : 'px-1'}`"
              cols="auto"
            >
              <!-- Internal link -->
              <v-btn
                text="Terms of Use"
                depressed
                elevation="0"
                color="navy"
                to="/terms"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="2">
          <v-row
            :class="`text-center ${!mdAndUp ? 'mb-5' : ''}`"
            justify="center"
            align="center"
          >
            <v-col
              class="text-center"
              :class="`${!mdAndUp ? 'px-1 py-5' : 'px-1'}`"
              cols="auto"
            >
              <v-btn
                text="Contact"
                class="mx-auto"
                elevation="0"
                variant="outlined"
                depressed
                to="resources/contact"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-footer>
</template>

<script setup lang="ts" >
import { useDisplay } from 'vuetify'

// mobile boolean for contitional rendering
const { mdAndUp } = useDisplay()
</script>
