<!-- Collapsable item list for related data objects on individual data pages -->
<template>
  <v-list-group
    :value="true"
  >
    <template #activator>
      <page-section-title class="text-capitalize">
        {{ title }}
      </page-section-title>
    </template>
    <div v-for="(d, i) in items" :key="i">
      <v-list-item
        :nuxt="true"
        :to="`/${route(d)}/${d.id}`"
      >
        <v-list-item>
          <v-list-item-title>
            {{ d.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item>
    </div>
  </v-list-group>
</template>
<script>
import { dataObjectToPluralTitle } from '~/assets/tools.js'

export default {
  name: 'DataLinks',
  props: ['objectType', 'items'],
  computed: {
    title () {
      return dataObjectToPluralTitle(this.objectType)
    }
  },
  methods: {
    route (obj) {
      // Plural last word of the object type, i.e. studies for case-study
      return dataObjectToPluralTitle(obj, true)
    }
  }
}
</script>
