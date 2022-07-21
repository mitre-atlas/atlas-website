<template>
  <div>
    <!-- <data-side-nav :items="items" /> -->

    <div>
      <page-title class="text-capitalize">
        {{ objectTypePlural }}
      </page-title>

      <p
        v-if="objectTypePlural in introText"
        v-html="$md.render(introText[objectTypePlural])"
      />
      <p
        v-else
        class="red--text text--darken-2"
      >
        Introductory text not found for {{ objectTypePlural }}.
        Edit the file at <code>/static/content/data-list-page-intros.yaml</code>
        to add <br>
        <pre>
        {{ objectTypePlural }}: |
          Some text here, which can include newlines, Markdown or HTML syntaxes
        </pre>
      </p>

      <p>
        The table below lists {{ objectTypePlural }} from {{ mitreTitle }}.
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
import { mapMutations } from 'vuex'
export default {
  async asyncData ({ $content }) {
    // Retrieve intro text from YAML file in static/content/
    const content = await $content('data-list-page-intros').fetch()
    return {
      introText: content
    }
  },
  layout: 'side-nav',
  mounted () {
    this.setNavItems(this.items)
  },
  data: ({ $config: { name }, $route: { params } }) => ({
    mitreTitle: name.mitre,
    objectTypePlural: params.objectTypePlural,
    capitalizedObjectTypePlural: `${params.objectTypePlural[0].toUpperCase()}${params.objectTypePlural.slice(1)}`
  }),
  head () {
    return {
      title: `${this.capitalizedObjectTypePlural} List | ${this.mitreTitle}`
    }
  },
  computed: {
    items () {
      return this.$store.getters.getDataObjectsByType(this.objectTypePlural)
    }
  },
  methods: {
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>
