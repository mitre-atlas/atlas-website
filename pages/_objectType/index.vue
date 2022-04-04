<template>
  <div>
    <page-title class="text-capitalize">
      {{ objectType }}
    </page-title>
    <p>
      Some introductory text here
    </p>
    <p>
      How to use the table
    </p>
    <info-table
      :show-filter-button="false"
      :items="items"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name }, $route: { params } }) => ({
    mitreTitle: name.mitre,
    objectType: params.objectType.substring(1) // x
  }),
  head () {
    return {
      // title: `${this.title} List | ${this.mitreTitle}`
    }
  },
  computed: {
    ...mapGetters(['getDataObjects']),
    items () {
      return this.$store.getters.getDataObjects[this.objectType]
    }
  }
}
</script>
