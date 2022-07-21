<template>
  <div>
    <div class="mx-8">
      <page-title>
        {{ study.name }}
      </page-title>

      <v-row>
        <v-col cols="8">
          <page-section-title>Summary</page-section-title>
          <v-list-item>
            <div v-html="$md.render(study.summary)" />
          </v-list-item>
        </v-col>

        <v-col cols="4">
          <study-details-card :study="study" class="mt-10" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <page-section-title> Procedure </page-section-title>

          <procedure-timeline :study="study" class="mt-5" />
        </v-col>
      </v-row>
      <v-row v-if="study.references">
        <v-col v-if="study.references.length > 0">
          <page-section-title>Sources</page-section-title>

          <ol class="mt-2 mb-3">
            <li v-for="(source, i) in study.references" :key="i" class="mb-2">
              <ref-source :source="source" />
            </li>
          </ol>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  layout: 'side-nav',
  data: () => ({
    charactersThreshold: 300,
    builder: false
  }),
  head () {
    return {
      title:
        this.study.name +
        ', Case Study: ' +
        this.$route.params.id +
        ` | ${this.$config.name.mitre}`
    }
  },
  computed: {
    study () {
      return this.$store.getters.getDataObjectById(this.$route.params.id)
    }
  },
  mounted () {
    this.setNavItems(this.$store.getters.getDataObjectsByType('case-studies'))
  },
  methods: {
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>
