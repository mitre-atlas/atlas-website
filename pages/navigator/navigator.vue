<template>
  <div>
    <!-- <div class="text-h2">{{ title }}</div> -->
    <page-title>{{ title }}</page-title>

    <!-- Below is just placeholder text for future language, for now I just put some language to start with so that it was there -->

    <!-- <p>
      The Navigator application linked below allows for an interactive experience with the Matrix displayed on the <a href="/matrix">Matrix Page</a>.
      The link below will redirect to a separate web page with the interactive Navigator.
    </p> -->

    <p>
        To view MITRE ATLAS data alongside MITRE ATT&CK<sup>&reg;</sup> Enterprise tactics and techniques, visit the ATLAS customized version of the ATT&CK Navigator here: <br><br><v-btn target="_blank" href="https://navigator.lt.mitre.org/">Interactive Navigator</v-btn>
    </p>

    <p>
        This customized Navigator encodes the ATLAS techniques as a separate platform called "ATLAS", and allows users to create complex visualizations containing both machine learning and enterprise techniques. For more information on the standard ATT&CK Navigator and how to use it, you can visit the <a target="_blank" href ="https://github.com/mitre-attack/attack-navigator">project’s GitHub page here</a> as well as watch a short <a target="_blank" href="https://www.youtube.com/watch?v=pcclNdwG8Vs.">demo video on YouTube</a>.
    </p>

    <!-- This customized Navigator encodes the ATLAS techniques as a separate “ML” platform, and allows users to create complex visualizations containing both machine learning and enterprise techniques. For more information on the standard ATT&CK Navigator and how to use it, you can visit the project’s GitHub page here  -- https://github.com/mitre-attack/attack-navigator -- as well as watch a short demo video on YouTube: https://www.youtube.com/watch?v=pcclNdwG8Vs. -->

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
