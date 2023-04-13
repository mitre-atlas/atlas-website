<template>
  <div>
    <page-title>{{ title }}</page-title>
    <v-tabs vertical>
      <v-tab v-for="updateFile in updateFilesList" :key="updateFile.slug">
        {{ updateFile.dateString }}
      </v-tab>
      <v-tab-item v-for="updateFile in updateFilesList" :key="updateFile.slug">
        <v-card flat>
          <v-card-text>
            <nuxt-content :document="updateFile" class="tw-prose" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import packageData from '../../package.json'
export default {
  async asyncData ({ $content }) {
    const updateFilesList = await $content('update-files')
      .sortBy('slug', 'desc')
      .fetch()

    // Add field for the date in string form, i.e. Mar 2022
    updateFilesList.map((f) => {
      // Turn the filename, i.e. 2022-03 into a Date
      f.dateString = new Date(f.slug).toLocaleDateString('default', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short'
      })
      return f
    })

    return {
      updateFilesList
    }
  },
  data: ({ $config: { name } }) => ({
    version: packageData.version,
    mitreTitle: name.mitre,
    shortName: name.short,
    title: 'Updates'
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }
}
</script>
