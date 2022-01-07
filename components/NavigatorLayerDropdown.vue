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
                Navigator Layer
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                  <a
                  @click="downloadNavigatorLayerFile"
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
import { downloadUrlAsFile } from 'static/data/tools.js'

export default {
  name: 'NavigatorLayerDropdown',
  props: ['study'],
  methods: {
    downloadNavigatorLayerFile () {
      // Construct full URL to individual case study Navigator Layer file on GitHub
      const rawLink = this.$config.individual_case_study.raw_link
      const id = this.study.id
      const suffix = this.$config.individual_case_study.suffix
      const url = rawLink + id + suffix
      // Serve up download of that file, named the same
      downloadUrlAsFile(url)
    }
  }
}
</script>
