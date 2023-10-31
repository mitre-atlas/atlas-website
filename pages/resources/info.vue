<template>
  <div>
    <page-title>{{ title }}</page-title>

    <page-section-title>
      Current {{ mitreTitle }} Version
    </page-section-title>

    <v-list subheader>
      <v-list-item>
        <div>
          <v-chip
            class="ma-1"
            color="primary"
            label
            style="float: left"
          >
            <v-icon left>
              mdi-code-tags
            </v-icon>
            Website v{{ $config.site_version }}
          </v-chip>

          <v-chip
            class="ma-1"
            color="secondary"
            label
            style="float: left"
          >
            <v-icon left>
              mdi-database
            </v-icon>
            Data v{{ getDataAttribute('version') }}
          </v-chip>
        </div>
      </v-list-item>

      <v-list-item
        to="/resources/updates"
        nuxt
      >
        <v-list-item-content>
          <v-list-item-title>{{ latestUpdateTitle }}</v-list-item-title>
          <v-list-item-subtitle>
            View details and prior versions on the Updates page
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <page-section-title>Accessing ATLAS Data</page-section-title>
    <div class="px-4 pb-4">
      <!-- Match padding indentation of surrounding list items -->
      <v-list two-line subheader>

       <v-list-item
        href="https://github.com/mitre-atlas/atlas-data"
        target="_blank"
       >
        <v-list-item-content>
          <v-list-item-title>As YAML</v-list-item-title>
          <v-list-item-subtitle>Source data files for editing and parsing</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        href="https://github.com/mitre-atlas/atlas-navigator-data"
        target="_blank"
       >
        <v-list-item-content>
          <v-list-item-title>As STIX</v-list-item-title>
          <v-list-item-subtitle>STIX 2.1 (.json) files, either ATLAS standalone or ATLAS + ATT&CK Enterprise</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        :value="true"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title style="color:black">As Excel</v-list-item-title>
            <v-list-item-subtitle>Excel (.xslx) files, built from the ATLAS STIX data using ATT&CK tools</v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <v-subheader>
          Click on a file below to download.
          <a href="https://github.com/mitre-atlas/atlas-navigator-stix-data#export-to-excel">&nbsp;See this README for more information.</a>
        </v-subheader>

        <v-list-item
          v-for="(excelFilepath, j) in getExcelFilepaths"
          :key="j"
          @click="downloadUrlAsFile(excelFilepath)"
        >
          <v-list-item-content>
            <!-- Get just the filename, i.e. excel-files/foo.xslx > foo.xslx -->
            <v-list-item-title>{{excelFilepath.substring(excelFilepath.indexOf('/')+1)}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list-group>

      </v-list>
    </div>

    <page-section-title>Instructional Videos</page-section-title>

    <div class="px-4 pb-4">
      <!-- Match padding indentation of surrounding list items -->
      The MITRE YouTube channel houses a <a target="_blank" href="https://youtube.com/playlist?list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu">video playlist</a> containing a collection of instructional videos for users of the {{ shortName }} site.
      <br><br>
      <p>
        Videos included:
      </p>
      <ul>
        <li><a target="_blank" href="https://www.youtube.com/watch?v=3FN9v-y-C-w&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=1">{{ mitreTitle }} Website Overview</a></li>
        <li><a target="_blank" href="https://www.youtube.com/watch?v=Np_ip14YJGg&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=2">Case Study Builder Walkthrough</a></li>
      </ul>
    </div>

    <git-hub-repos />
  </div>
</template>
<router>
  {
    alias: '/resources'
  }
</router>
<script>
import { mapGetters } from 'vuex'
import { downloadUrlAsFile } from '~/assets/tools.js'

export default {
  async asyncData ({ $content }) {
    const currentUpdatePage = await $content('update-files').sortBy('slug', 'desc').limit(1).fetch()
    const currentUpdatePageData = currentUpdatePage[0]

    return {
      currentUpdatePageData
    }
  },
  data: ({ $config: { name } }) => ({
    mitreTitle: name.mitre,
    shortName: name.short,
    title: 'General Information'
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  },
  computed: {
    ...mapGetters(['getDataAttribute', 'getExcelFilepaths']),
    latestUpdateTitle () {
      // ex. March 2022
      return new Date(this.currentUpdatePageData.slug)
        .toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long' }
        )
    }
  },
  methods: {
    downloadUrlAsFile (url) {
      downloadUrlAsFile(url)
    }
  }
}
</script>
