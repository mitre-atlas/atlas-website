<template>
  <v-card
    dark
    :color="item.color"
    :href="item.link"
    target="_blank"
    >
    <div class="d-flex flex-no-wrap align-center">
      <v-avatar
        size="72"
        >
        <v-icon
          dark
          right
          large
          >
          {{ item.icon }}
        </v-icon>
      </v-avatar>

      <div>
        <v-card-title
          class="text-h6"
          v-text="item.title"
          >
        </v-card-title>
        <v-card-subtitle>
          {{ item.text }}
        </v-card-subtitle>
      </div>
    </div>
  </v-card>
</template>

<script>
/**
 * Cards of contact buttons on the Contact Us page.
 */
export default {
  name: 'ContactButton',
  props: [
    /**
     * List of information to be rendered on the card
     * @type {Object}
     */
    'item'
  ]
}
</script>
