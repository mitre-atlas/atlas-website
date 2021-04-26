<template>
  <div>
    <breadcrumbs></breadcrumbs>
    <div class="text-h2">{{title}}</div>
    <div class="text-body-1">{{ description }}</div>

    <v-data-iterator
      :items="getStudies"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      >

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="6"
          >
            <study-card :study="item" />
          </v-col>
        </v-row>
      </template>

    </v-data-iterator>

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
    ...mapGetters(['getStudies'])
  }
}
</script>
