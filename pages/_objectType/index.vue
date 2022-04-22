<template>
  <div>
    <data-side-nav :title="objectType" :items="items" />

    <div>
      <page-title class="text-capitalize">
        {{ objectType }}
      </page-title>

      <p
        v-if="objectType in introText"
        v-html="$md.render(introText[objectType])"
      />

      <p>
        The table below lists {{ objectType }} from {{ mitreTitle }}.
        Scroll through the table or use the filter to narrow down the information.
      </p>

      <info-table
        :show-filter-button="false"
        :items="items"
      />
    </div>
  </div>
</template>
<script>
export default {
  async asyncData ({ $content }) {
    // Retrieve intro text from YAML file in static/content/
    const content = await $content('data-list-page-intros').fetch()
    return {
      introText: content
    }
  },
  data: ({ $config: { name }, $route: { params } }) => ({
    mitreTitle: name.mitre,
    objectType: params.objectType
  }),
  head () {
    return {
      title: `${this.objectType} List | ${this.mitreTitle}`
    }
  },
  computed: {
    items () {
      return this.$store.getters.getDataObjectsByType(this.objectType)
    }
  }
}
</script>
