<template>
  <div>
    <div class="text-h4 pt-10">{{ study.name }}</div>

    <v-row>

      <v-col cols="8">
        <page-section-title text="Summary" />

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
        <page-section-title text="Procedure" />

        <procedure-timeline :study="study" class="mt-5" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <page-section-title text="Sources" />

        <ol class="mt-2">
          <li v-for="(source, i) in study.sources" :key="i">
            <p v-linkified>{{ source }}</p>
          </li>
        </ol>
      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  computed: {
    study () {
      return this.$store.getters.getStudyById(this.$route.params.id)
    }
  }
}
</script>
