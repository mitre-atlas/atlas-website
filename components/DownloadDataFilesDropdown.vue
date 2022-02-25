<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn
        color="inherit"
        v-bind="attrs"
        v-on="on"
      >
        Case study data
        <v-icon right>
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>

    <v-list>
      <download-powerpoint :study="study" :builder="false" />

      <v-list-item @click="downloadYaml">
        <v-list-item-icon style="margin-right: 0px;">
          <v-icon small>
            mdi-arrow-collapse-down
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            Download as raw data (.yaml)
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { downloadUrlAsFile } from 'static/data/tools.js'

export default {
  name: 'DownloadDataFilesDropdown',
  props: ['study'],
  data () {
    return {
      studyYaml: this.study
    }
  },
  methods: {
    downloadYaml () {
      // Construct full URL to case study data file on GitHub
      const rawLink = this.$config.individual_case_study.yaml_raw_link
      const id = this.study.id
      const suffix = this.$config.individual_case_study.yaml_file_suffix
      const url = rawLink + id + suffix
      // Serve up download of that file, named the same
      downloadUrlAsFile(url)
    }
  }
}
</script>
