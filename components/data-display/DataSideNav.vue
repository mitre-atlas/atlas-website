<template>
  <v-navigation-drawer
    clipped
    app
    >
    <v-list-item class="mt-10">
      <v-list-item-content>
        <v-list-item-title class="title text-capitalize">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list dense nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :nuxt="true"
        :to="item.route"
        :ripple="false"
      >
        <v-list-item>
          <v-list-item-content class="blue--text text--darken-2" style="font-size: 0.9375rem;">
            <!-- Font size and color to match v-expansion-panel-header style -->
            {{ item.name }}
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

export default {
  name: 'DataSideNav',
  props: ['items'],
  computed: {
    title () {
      // Plural object type with spaces instead of dashes, if any
      return dataObjectToPluralTitle(this.items[0])
    }
  }
}
</script>
