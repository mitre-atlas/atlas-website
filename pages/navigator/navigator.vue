<template>
  <div>
    <!-- <div class="text-h2">{{ title }}</div> -->
    <page-title>{{ title }}</page-title>

    <!-- Below is just placeholder text for future language, for now I just put some language to start with so that it was there -->
    <p>
      The Navigator application linked below allows for an interactive experience with the Matrix displayed on the <a href="/matrix">Matrix Page</a>.
      The link below will redirect to a separate web page with the interactive Navigator.
    </p>

    <v-btn href="https://navigator.lt.mitre.org/">Interactive Navigator</v-btn>

    <!-- <v-row  class="mt-10">
      <matrix-attack-style :matrix="getMatrix" />
    </v-row> -->

  </div>

</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: `${name.short} Navigator`
  })
//   computed: {
//     ...mapGetters(['getMatrix'])
//   }
}
</script>

<style scoped>
.row {
  overflow: auto;
}
a {
  text-decoration: none;
}
</style>
