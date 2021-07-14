<template>
<v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                elevation="0"
                color="inherit"
                v-bind="attrs"
                v-on="on"
              >
                ATLAS Navigator Layer
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                  <a
                  @click="saveFile($config.individual_case_study.raw_link, study.id, $config.individual_case_study.suffix)"
                  style="color: inherit"
                  >Download</a><v-icon
                      small
                    >mdi-arrow-collapse-down</v-icon>
              </v-list-item>
              <v-list-item>
                <a
                  :href="
                    $config.individual_case_study.navigator_link +
                    study.id +
                    $config.individual_case_study.suffix
                  "
                  target="_blank"
                  style="color: inherit"
                  >View<v-icon small>mdi-open-in-new</v-icon></a
                >
              </v-list-item>
            </v-list>
          </v-menu>
</template>

<script>
export default {
  name: 'NavigatorLayerDropdown',
  props: ['study'],
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
