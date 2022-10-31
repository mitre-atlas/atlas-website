<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn
        color="inherit"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>
          mdi-download
        </v-icon>
        Download Data
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
            mdi-file
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            Raw data (.yaml)
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { downloadStudyFile } from '~/assets/tools.js'

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
      const id = this.study.id
      const studyWrap = { study: this.studyYaml }
      // Serve up download of that file, named the same
      downloadStudyFile(studyWrap, id)
    }
  }
}
</script>
