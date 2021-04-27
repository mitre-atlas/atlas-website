<template>
  <div>
    <breadcrumbs></breadcrumbs>
    <page-title>{{ title }}</page-title>
    <div class="text-body-1">{{ description }}</div>

    <info-table :items="mappedStudies" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    title: 'Case Studies',
    description: 'Lists associated case studies.',
    itemsPerPage: '20',
    page: 1,
    search: '',
    sortDesc: false,
    sortBy: 'name'
  }),
  computed: {
    ...mapGetters(['getStudies']),
    mappedStudies () {
      // Duplicate the 'summary' field into 'description' for use with InfoTable
      return this.getStudies.map((study) => {
        study.description = study.summary
        return study
      })
    }
  }
}
</script>
