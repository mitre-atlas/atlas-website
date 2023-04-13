<template>
  <v-dialog
    v-if="isCaseStudyPage"
    v-model="show"
    max-width="500px"
    style="z-index:3010"
    @input="scrollToTop"
  >
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="secondary" text v-on="on">
        <v-icon left>
          mdi-information-outline
        </v-icon>
        Key Info
      </v-btn>
    </template>
    <v-card>
      <v-card-title id="top">Case Study Legend</v-card-title>
      <v-card-text style="color: #424242">
        <div v-for="(data, dataCategory) in legendData" :key="dataCategory">
          <div v-if="dataCategory === 'legend'">
            <!-- Get each field (inident date, actor, etc) -->
            <v-list-item-group v-for="field in data" :key="field">
              <v-list-item-content v-if="(field.name != 'Title') && (field.name != 'Summary')">
                <span class="font-weight-bold">
                  <v-icon>{{ field.icon }}</v-icon> {{ field.name }}:
                </span>
                {{ field.description }}
              </v-list-item-content>
            </v-list-item-group>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          plain
          color="primary"
          @click="scrollToTop(false)"
          @keyup.enter="scrollToTop(false)"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
/**
 * Legend containing information about each field in a case study.
 */
export default {
  name: 'StudyDetailsCardLegend',
  data () {
    return {
      /**
       * Determines if the dialog is showing
       * @type {Boolean}
       */
      show: false,
      /**
       * Will hold the legend data to render
       * @type {Array}
       */
      legendData: []
    }
  },
  /**
   * Get the legend data and store in the data
   */
  async fetch () {
    this.legendData = await this.$content('case-study-legend').fetch()
  },
  computed: {
    /**
     * Only include the legend on case study pages
     * @returns {Boolean}
     */
    isCaseStudyPage () {
      if (this.$route.path.toString().includes('/studies/AML')) {
        return true
      }
      return false
    }
  },
  methods: {
    /**
     * Each time you close and reopen the dialog, it will always open to the top of the legend.
     * @param {Boolean} show
     */
    scrollToTop (show) {
      if (!show) {
        document.getElementById('top').scrollIntoView()
        this.show = show
      }
    }
  }
}
</script>
