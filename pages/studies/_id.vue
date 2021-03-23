<template>
  <div>
    <div class="text-h2 pt-10">{{ study.name }}</div>

    <v-row>
      <v-col cols="4">
        <page-section-title text="Summary" />
        <study-details-card :study="study" />
      </v-col>

      <v-col cols="8">
        <page-section-title text="Procedure" />
        <procedure-timeline :study="study" class="mt-5" />
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
