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
<script>
import { mapGetters } from 'vuex'

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
    ...mapGetters(['getDataAttribute']),
    latestUpdateTitle () {
      // ex. March 2022
      return new Date(this.currentUpdatePageData.slug)
        .toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long' }
        )
    }
  }
}
</script>
