<template>
  <div>
    <div class="mx-8">
      <page-title>
        {{ study.name }}
        <v-chip
          v-if="study['case-study-type'] == 'exercise'"
          class="ma-1"
          color="blue"
          text-color="blue"
          outlined
          label
        >
          <v-icon left>
            mdi-clipboard-file-outline
          </v-icon>
          Exercise
        </v-chip>
        <v-chip
          v-if="study['case-study-type'] == 'incident'"
          class="ma-1"
          color="purple"
          text-color="purple"
          outlined
          label
        >
          <v-icon left>
            mdi-alert-circle-outline
          </v-icon>
          Incident
        </v-chip>

        <!-- <v-chip
      class="ma-1"
      color="green"
      text-color="white"
    >
    <v-icon left>
      mdi-alert
    </v-icon>
      Low Severity
    </v-chip> -->
        <!-- <v-chip
      class="ma-1"
      color="orange"
      text-color="white"
    >
    <v-icon left>
      mdi-alert
    </v-icon>
      Medium Severity
    </v-chip>
        <v-chip
      class="ma-1"
      color="red"
      text-color="white"
    >
    <v-icon left>
      mdi-alert
    </v-icon>
      High Severity
    </v-chip> -->
      </page-title>

      <v-col>
        <v-row align="center">
          <v-col
            cols="12"
            sm="5"
            md="7"
          >
            <span class="font-weight-regular">
              Incident Date:&nbsp;
            </span>
            <span v-if="study['incident-date']" class="font-weight-bold">
              {{ formattedIncidentDate }}&nbsp;
            </span>
            <span v-if="study.reporter" class="font-weight-regular">
              | Reporter:&nbsp;
            </span>
            <span v-if="study.reporter" class="font-weight-bold">
              {{ study.reporter }}
            </span>
            <br>
            <span class="font-weight-regular">
              Actor:&nbsp;
            </span>
            <span v-if="study.actor" class="font-weight-bold">
              {{ study.actor }}&nbsp;
            </span>
            <span class="font-weight-regular">
              | Target:&nbsp;
            </span>
            <span v-if="study.target" class="font-weight-bold">
              {{ study.target }}
            </span>
          </v-col>
          <v-spacer />
          <v-col>
            <div
              :align="$vuetify.breakpoint.mdAndUp ? 'right': 'left'"
            >
              <download-data-files-dropdown :study="study" />
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-row class="mt-3">
        <v-col>
          <v-row align="center">
            <page-section-title class="ml-3">
              Summary
            </page-section-title>
          </v-row>
          <v-list-item class="mt-5">
            <div v-html="$md.render(study.summary)" />
          </v-list-item>
        </v-col>
      </v-row>

      <br>
      <v-divider class="pb-10" />

      <v-row align="center">
        <v-col>
          <v-row align="center">
            <page-section-title class="ml-3">
              Procedure
            </page-section-title>
            <v-spacer />
            <navigator-layer-dropdown :study="study" />
          </v-row>
          <procedure-timeline :study="study" class="mt-5" />
        </v-col>
      </v-row>
      <v-row v-if="study.references && study.references.length > 0">
        <v-col>
          <page-section-title>Sources</page-section-title>

          <ol class="mt-2 mb-3">
            <li v-for="(source, i) in study.references" :key="i" class="mb-2">
              <ref-source :source="source" />
            </li>
          </ol>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatCaseStudyIncidentDate } from '~/assets/tools.js'

export default {
  layout: 'side-nav',
  data: () => ({
    charactersThreshold: 300,
    builder: false
  }),
  head () {
    return {
      title:
        this.study.name +
        ', Case Study: ' +
        this.$route.params.id +
        ` | ${this.$config.name.mitre}`
    }
  },
  computed: {
    study () {
      return this.$store.getters.getDataObjectById(this.$route.params.id)
    },
    formattedIncidentDate () {
      return formatCaseStudyIncidentDate(this.study)
    }
  },
  mounted () {
    this.setNavItems(this.$store.getters.getDataObjectsByType('case-studies'))
  },
  methods: {
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>

<style scoped>
.v-chip::before { color: transparent }
</style>
