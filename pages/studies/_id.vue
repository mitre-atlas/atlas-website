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

        <ol class="mt-2">
          <li v-for="(source, i) in study.references" :key="i">
            <p v-linkified>{{ source }}</p>
          </li>
        </ol>
      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  head () {
    return {
      title: this.$store.getters.getStudyById(this.$route.params.id).name + ', Case Study: ' + this.$route.params.id + ' | MITRE ATLAS'
    }
  },
  computed: {
    study () {
      return this.$store.getters.getStudyById(this.$route.params.id)
    }
  }
}
</script>
