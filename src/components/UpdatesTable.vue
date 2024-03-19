<template>
  <div :class="`${mdAndUp ? 'text-right' : 'text-left'} pr-10 pt-7 `" style="min-width: 150px;">

      <div class="text-h6"> All Updates </div>
      <v-list>
        <v-list-item
          v-for="(update, i) in updates"
          :key="i"
          class="text-h6 pa-0 text-blue text-wrap"
          :to="update.route"
        >
        <div
          :to="update.route"
        >
        {{update.date}}
       </div>
      </v-list-item>
      </v-list>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
  import { useDisplay } from 'vuetify'

  // mobile boolean for contitional rendering
  const { mdAndUp } = useDisplay()

  const updates = reactive([])

  // Dynamically import any Markdown files found
  const modules = import.meta.glob(
    '@/../public/content/update-files/*.md',
    { query: '?raw', import: 'default', eager: true }
  )

  // Regular expression to match the YYYY-MM date pattern in the filename
  // i.e. <filepath>/2024-01.md
  const datePatternFilename = /(\d{4}-\d{2}).md/
  // Regular expression to match the MonthName YYYY date pattern in the markdown
  // i.e. #### January 2024
  const datePatternTitle = /#+ (\w+) (\d{4})/

  // Parse out the numeric filenames and formatted date titles from the Markdown content
  for (const [filepath, content] of Object.entries(modules)) {
    const update = {}
    // Parse out date portion of filename for routing
    const filenameDateMatches = datePatternFilename.exec(filepath)
    if (filenameDateMatches) {
      const filenameDate = filenameDateMatches[1]
      update.route = filenameDate
    }

    // Parse out the title, which is MONTH YEAR
    const titleMatches = datePatternTitle.exec(content)
    if (titleMatches) {
      // Month (first three letters) Year
      const title = `${titleMatches[1].substring(0, 3)} ${titleMatches[2]}`
      update.date = title
    }

    updates.push(update)
  }

  // Most recent first
  updates.reverse()
</script>
