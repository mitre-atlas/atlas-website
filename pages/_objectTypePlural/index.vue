<template>
  <div>
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
        :items="items"
      />
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  layout: 'side-nav',
  async asyncData ({ $content }) {
    // Retrieve intro text from YAML file in static/content/
    const content = await $content('data-list-page-intros').fetch()
    return {
      introText: content
    }
  },
  data: ({ $config: { name }, $route: { params } }) => ({
    mitreTitle: name.mitre,
    objectTypePlural: params.objectTypePlural,
    capitalizedObjectTypePlural: `${params.objectTypePlural[0].toUpperCase()}${params.objectTypePlural.slice(1)}`,
    selectedMatrices: []
  }),
  head () {
    return {
      title: `${this.capitalizedObjectTypePlural} List | ${this.mitreTitle}`
    }
  },
  computed: {
    items () {
      // Retrieve the object of matrix IDs mapped to data objects
      return this.$store.getters.getDataObjectsByType(this.objectTypePlural, undefined, true)
    }
  },
  mounted () {
    this.setNavItems(this.$store.getters.getDataObjectsByType(this.objectTypePlural))
  },
  methods: {
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>
