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
/**
 * Render source with supplied title and url.
 */
export default {
  name: 'RefSource',
  props: [
    /**
     * Information about a source
     * @type {Object}
     */
    'source'
  ],
  data: () => ({
    /**
     * Value to decide if a source description is long
     * @type {int}
     */
    charactersThreshold: 300
  }),
  methods: {
    /**
     * Calls tools.js function to open url in a new tab.
     */
    openNewTab
  }
}
</script>
