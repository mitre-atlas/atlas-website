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
export default {
  name: 'DataLinks',
  props: ['title', 'items'],
  methods: {
    route (obj) {
      // URL part, i.e. studies, tactics, techniques, etc.
      // Typically the pluralization of the object type
      if (obj['object-type'] === 'case-study') {
        return 'studies'
      }
      // Pluralize the object type
      return `${obj['object-type']}s`
    }
  }
}
</script>
