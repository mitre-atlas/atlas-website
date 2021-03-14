<template>
  <div>
    <div class="text-h2">{{title}}</div>
    <p>{{description}}</p>

    <v-row>
      <v-col v-for="(tactic, i) in matrix.tactics" :key="i">

        <v-toolbar flat>
          <v-toolbar-title>{{ tactic.name }}</v-toolbar-title>
          <v-spacer />
          <v-badge
            :content="tactic.techniques.length"
            inline
            color="grey"
          />
        </v-toolbar>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: 'Adversarial ML Matrix',
    description: 'Below are the tactics and techniques representing the adversarial machine learning threat matrix.'
  }),
  computed: {
    matrix () {
      const tactics = this.$store.getters.getTactics
      const fullTactics = tactics.map((t) => {
        t.techniques = this.$store.getters.getTechniquesByTacticId(t.id)
        return t
      })
      return {
        tactics: fullTactics
      }
    }
  }
}
</script>
