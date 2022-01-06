<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        color="inherit"
        style="padding: 0;"
        v-bind="attrs"
        v-on="on"
      >
        Case study data
        <v-icon right>mdi-menu-down</v-icon>
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
      const rawLink = this.$config.individual_case_study.yaml_raw_link
      const id = this.study.id
      const suffix = this.$config.individual_case_study.yaml_file_suffix
      const url = rawLink + id + suffix
      // Get file name from url.
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onload = function () {
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(xhr.response) // xhr.response is a blob
        a.download = id + suffix // Set the file name.
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a = null
      }
      xhr.open('GET', url)
      xhr.send()
    }
  }
}
</script>
