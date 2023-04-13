<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn
        class="mx-5 px-4"
        color="inherit"
        v-bind="attrs"
        v-on="on"
      >
        <img width="35" height="35" class="mr-3 ml-0" src="../assets/nav-layer-icon.png" />
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
/**
 * Dropdown that allows you to select if you want to view a case study in the
 * ATLAS navigator or to download the navigation data as json.
 */
export default {
  name: 'NavigatorLayerDropdown',
  props: [
    /**
     * Study to be downloaded or viewed in the navigator layer
     * @type {Object}
     */
    'study'
  ],
  /* eslint-disable camelcase */
  data ({ $config: { individual_case_study } }) {
    return {
      /**
       * Construct full URL to individual case study Navigator Layer file on GitHub
       * @type {String}
       */
      rawJsonIndividualCaseStudyLayer: individual_case_study.raw_link + this.study.id + individual_case_study.suffix
    }
  },
  computed: {
    /**
     * Returns full URL to Navigator with raw GitHub Navigator layer loaded
     * @returns {String}
     */
    navigatorUrlIndividualCaseStudyLayer () {
      return this.$config.individual_case_study.navigator_link + this.rawJsonIndividualCaseStudyLayer
    }
  },
  /* eslint-enable camelcase */
  methods: {
    /**
     * Serve up download of that file, named the same
     */
    downloadNavigatorLayerFile () {
      downloadUrlAsFile(this.rawJsonIndividualCaseStudyLayer)
    }
  }
}
</script>
