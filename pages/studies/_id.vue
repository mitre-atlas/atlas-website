<template>
  <div>
    <breadcrumbs />
    <div class="text-h4 pt-10">
      {{ study.name }}
    </div>

    <v-row>
      <v-col cols="8">
        <page-section-title>Summary</page-section-title>
        <div class="text-body-1 mt-5" v-html="$md.render(study.summary)" />
      </v-col>

      <v-col cols="4">
        <study-details-card :study="study" class="mt-10" />
      </v-col>
    </v-row>

    <v-container>
      <v-row>
        <v-col>
          <page-section-title> Procedure </page-section-title>

          <procedure-timeline :study="study" class="mt-5" />
        </v-col>
      </v-row>
      <v-row v-if="study.references">
        <v-col>
          <page-section-title>Sources</page-section-title>

          <ol class="mt-2 mb-3">
            <li v-for="(source, i) in study.references" :key="i" class="mb-2">
              <ref-source :source="source" />
            </li>
          </ol>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    charactersThreshold: 300,
    builder: false
  }),
  head () {
    return {
      title: this.$store.getters.getStudyById(this.$route.params.id).name +
        ', Case Study: ' + this.$route.params.id +
        ` | ${this.$config.name.mitre}`
    }
  },
  computed: {
    study () {
      return this.$store.getters.getStudyById(this.$route.params.id)
    }
  },
  methods: {
    openNewTab (url) {
      window.open(url, '_blank')
    }
  }
}
</script>
