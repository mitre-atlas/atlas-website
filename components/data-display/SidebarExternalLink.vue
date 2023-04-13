<template>
  <a :href="url" target="_blank">
    {{ text }}
    <v-icon x-small> mdi-open-in-new </v-icon>
  </a>
</template>

<script>
/**
 * Displays a link that opens in a new tab
 */
export default {
  name: 'SidebarExternalLink',
  props: [
    /**
     * Link text
     */
    'text',
    /**
     * Link URL
     */
    'url'
  ]
}
</script>
