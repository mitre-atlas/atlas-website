<template>
  <div>
    <breadcrumbs />
    <div class="text-h4 pt-10">{{ study.name }}</div>

    <v-row>

      <v-col cols="8">
        <page-section-title>Summary</page-section-title>

        <div class="text-body-1 mt-5">
        {{ study.summary }}
        </div>
      </v-col>

      <v-col cols="4">
        <study-details-card :study="study" class="mt-10" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <page-section-title>Procedure</page-section-title>
          <!-- <span class="pink--text">
            TODO link to custom layer on ATT&CK Navigator
            <v-icon small>mdi-open-in-new</v-icon>
          </span> -->

        <procedure-timeline :study="study" class="mt-5" />
      </v-col>
    </v-row>

    <v-row v-if="study.references">
      <v-col>
        <page-section-title>Sources</page-section-title>

        <ol class="mt-2 mb-3">
          <li class="mb-2" v-for="(source, i) in study.references" :key="i">
            <template v-if="(source.url && source.sourceDescription) && source.sourceDescription.length > charactersThreshold">
              <p class="mb-1">{{ source.sourceDescription }}</p>
              <a @click="openNewTab(source.url)">{{ source.url }}</a>
              <v-icon small>mdi-open-in-new</v-icon>
            </template>
            <template v-else-if="source.url">
              <a @click="openNewTab(source.url)">{{ source.sourceDescription || source.url }}</a>
              <v-icon small>mdi-open-in-new</v-icon>
            </template>
            <p v-else>{{ source.sourceDescription }}</p>
          </li>
        </ol>
      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  data: () => ({
    charactersThreshold: 300
  }),
  head () {
    return {
      title: this.$store.getters.getStudyById(this.$route.params.id).name + ', Case Study: ' + this.$route.params.id + ` | ${this.$config.name.mitre}`
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
