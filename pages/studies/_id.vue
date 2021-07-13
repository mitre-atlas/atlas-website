<template>
  <div>
    <breadcrumbs></breadcrumbs>
    <div class="text-h4 pt-10">{{ study.name }}</div>

    <v-row>
      <v-col cols="8">
        <page-section-title>Summary</page-section-title>

        <div class="text-body-1 mt-5">
          {{ study.summary }}
        </div>
      </v-col>

      <v-col cols="4">
        <study-details-card :study="study" class="mt-10" />
      </v-col>
    </v-row>

      <v-row >
        <v-col>
          <page-section-title> Procedure </page-section-title>
        </v-col>
        <v-col
        md="4"
        offset-md="4">
          <page-section-title>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                flat
                elevation="0"
                color="inherit"
                depressed
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
          </page-section-title>
        </v-col>
        <!-- <span class="pink--text">
            TODO link to custom layer on ATT&CK Navigator
            <v-icon small>mdi-open-in-new</v-icon>
          </span> -->

        <procedure-timeline :study="study" class="mt-5" />
      </v-row>
    <v-row v-if="study.references">
      <v-col>
        <page-section-title>Sources</page-section-title>

        <ol class="mt-2">
          <li v-for="(source, i) in study.references" :key="i">
            <p v-linkified>{{ source }}</p>
          </li>
        </ol>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title:
        this.$store.getters.getStudyById(this.$route.params.id).name +
        ', Case Study: ' +
        this.$route.params.id +
        ' | MITRE ATLAS'
    }
  },
  computed: {
    study () {
      return this.$store.getters.getStudyById(this.$route.params.id)
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
