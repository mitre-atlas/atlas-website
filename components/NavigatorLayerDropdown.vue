<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn
        color="inherit"
        v-bind="attrs"
        v-on="on"
      >
        Navigator Layer
        <v-icon right>
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        :href="navigatorUrlIndividualCaseStudyLayer"
        target="_blank"
      >
        <v-list-item-icon style="margin-right: 0px;">
          <v-icon small>
            mdi-open-in-new
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            View on ATLAS Navigator
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="downloadNavigatorLayerFile">
        <v-list-item-icon style="margin-right: 0px;">
          <v-icon small>
            mdi-arrow-collapse-down
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            Download as raw data (.json)
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { downloadUrlAsFile } from '~/assets/tools.js'

export default {
  name: 'NavigatorLayerDropdown',
  props: ['study'],
  /* eslint-disable camelcase */
  data ({ $config: { individual_case_study } }) {
    return {
      // Construct full URL to individual case study Navigator Layer file on GitHub
      rawJsonIndividualCaseStudyLayer: individual_case_study.raw_link + this.study.id + individual_case_study.suffix,
      navigatorUrlIndividualCaseStudyLayer: individual_case_study.navigator_link + this.study.id + individual_case_study.suffix
    }
  },
  /* eslint-enable camelcase */
  methods: {
    downloadNavigatorLayerFile () {
      // Serve up download of that file, named the same
      downloadUrlAsFile(this.rawJsonIndividualCaseStudyLayer)
    }
  }
}
</script>
