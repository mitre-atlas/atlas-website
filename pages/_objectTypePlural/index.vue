<template>
  <div>
    <div>
      <page-title class="text-capitalize">
        {{ objectTypePlural }}
      </page-title>

      <p
        v-if="objectTypePlural in introText"
        class="tw-prose tw-max-w-none"
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

      <!-- Temporary banner for mitigations status -->
      <p v-if="objectTypePlural == 'mitigations'">
        <v-banner outlined rounded>
          <v-icon slot="icon" color="info">
            mdi-comment-alert-outline
          </v-icon>

          This draft of mitigations are defined based on current ATLAS case studies.
          <br>
          Feedback and contributions are welcome - please join the <a href="https://mitreatlas.slack.com/archives/C050WG4PNES">#mitigations channel on Slack</a>.
        </v-banner>
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
/**
 * @name _objectTypePlural/index
 *
 * This page is generated for each _objectTypePlural type (tactic/techniques/mitigations/case studies)
 * in the ATLAS matrix. Each page contains a brief description and an info table enumerating
 * all object of that given type.
 */
export default {
  layout: 'side-nav',
  validate ({ params, store }) {
    // Ensure that the route is valid
    return store.getters.getObjectTypePluralValues.includes(params.objectTypePlural)
  },
  // Retrieve intro text from YAML file in static/content/
  async asyncData ({ $content }) {
    const content = await $content('data-list-page-intros').fetch()
    return {
      introText: content
    }
  },
  data: ({ $config: { name }, $route: { params } }) => ({
    /**
     * MITRE ATLAS (TM) title
     * @type {String}
     */
    mitreTitle: name.mitre,
    /**
     * This page's object type from ATLAS matrix
     * @type {String}
     */
    objectTypePlural: params.objectTypePlural,
    /**
     * This page's object type from ATLAS matrix, capitalized
     * @type {String}
     * @todo only used once, does it need a data value? Can capitalize function from tools be used here?
     */
    capitalizedObjectTypePlural: `${params.objectTypePlural[0].toUpperCase()}${params.objectTypePlural.slice(1)}`
  }),
  head () {
    return {
      /**
       * The title of this object type's page
       * @type {String}
       */
      title: `${this.capitalizedObjectTypePlural} List | ${this.mitreTitle}`
    }
  },
  computed: {
    /**
     * Retrieve the object of matrix IDs mapped to data objects
     * @returns {Object}
     */
    items () {
      return this.$store.getters.getDataObjectsByType(this.objectTypePlural, undefined, true)
    }
  },
  mounted () {
    // Set the items to appear in the side nav based on which object's page this is
    this.setNavItems(this.$store.getters.getDataObjectsByType(this.objectTypePlural))
  },
  methods: {
    // Use SET_NAV_DRAWER_ITEMS mutation to commit what items will appear in the side nav
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>
