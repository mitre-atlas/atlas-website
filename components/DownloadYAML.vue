<template>
  <v-btn
    v-if="isBuilder"
    color="secondary"
    v-on="on"
    @click="makePPT"
  >
    <v-icon left>
      mdi-download
    </v-icon>
    Download YAML
  </v-btn>
  <v-btn
    v-else
    elevation="0"
    color="inherit"
    v-bind="attrs"
    v-on="on"
    @click="saveFile($config.individual_case_study.raw_link, study.id, $config.individual_case_study.suffix)"
  >
    Download YAML
  </v-btn>
</template>

<script>
export default {
  name: 'DownloadYAML',
  props: ['study'],
  data () {
    return {
      studyYaml: this.study
    }
  },
  methods: {
    saveFile (rawLink, id, suffix) {
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
