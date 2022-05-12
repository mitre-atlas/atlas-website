<template>
  <div>
    <data-side-nav :items="items" />

    <div>
      <breadcrumbs />

      <page-title>
        {{ title }}
      </page-title>

      <v-row>
        <v-col cols="8">
          <page-section-title>
            Summary
          </page-section-title>
          <v-list-item>
            <!-- eslint-disable vue/no-v-html -->
            <div v-html="$md.render(dataObject.description)" />
          </v-list-item>
        </v-col>

        <v-col cols="4">
          <data-sidebar :data-object="dataObject" :related-objects="dataObject.relatedObjects" />
        </v-col>
      </v-row>

      <data-links
        v-for="(relatedObjs, objectType) in dataObject.relatedObjects"
        :key="objectType"
        :object-type="objectType"
        :items="relatedObjs"
      />
    </div>
  </div>
</template>
<script>
export default {
  data: ({ $config: { name }, $route: { params } }) => ({
    mitreTitle: name.mitre,
    objectTypePlural: params.objectTypePlural,
    id: params.id
  }),
  head () {
    return {
      // title: `${this.title} List | ${this.mitreTitle}`
    }
  },
  computed: {
    dataObject () {
      return this.$store.getters.getDataObjectById(this.id)
    },
    title () {
      // Prepend parent technique name for a subtechnique
      if ('subtechnique-of' in this.dataObject) {
        const parentTechnique = this.$store.getters['subtechnique/getParent'](this.dataObject)
        return `${parentTechnique.name}: ${this.dataObject.name}`
      }
      // Otherwise use the name
      return this.dataObject.name
    },
    items () {
      return this.$store.getters.getDataObjectsByType(this.objectTypePlural)
    }
  }
}
</script>
