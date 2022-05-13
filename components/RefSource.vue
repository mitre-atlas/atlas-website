<!-- Renders the description with a hyperlink if specified -->
<template>
  <div>
    <!-- Source has both URL and description (long) - render the link below the description -->
    <template v-if="(source.url && source.title) && source.title.length > charactersThreshold">
      <p class="mb-1">
        {{ source.title }}
      </p>
      <a @click="openNewTab(source.url)">{{ source.url }}</a>
      <v-icon small>
        mdi-open-in-new
      </v-icon>
    </template>
    <!-- Source has URL, use description as hyperlink text if available -->
    <template v-else-if="source.url">
      <a @click="openNewTab(source.url)">{{ source.title || source.url }}</a>
      <v-icon small>
        mdi-open-in-new
      </v-icon>
    </template>
    <!-- Otherwise render the description -->
    <div v-else>
      {{ source.title }}
    </div>
  </div>
</template>
<script>
import { openNewTab } from '~/assets/tools.js'

export default {
  name: 'RefSource',
  props: [
    'source'
  ],
  data: () => ({
    charactersThreshold: 300
  }),
  methods: {
    openNewTab
  }
}
</script>
