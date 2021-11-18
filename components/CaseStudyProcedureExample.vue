<!-- List item with case study name title and procedure step description subtitle,
for use in TT case study lists -->

<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title v-html="this.study.name" />
      <v-list-item-subtitle v-html="$md.render(this.procedureStepDescription)" />
    </v-list-item-content>
  </v-list-item>
</template>
<script>
export default {
  name: 'CaseStudyProcedureExample',
  props: [
    'techniqueId',
    'study'
  ],
  computed: {
    procedureStepDescription () {
      // Retrieve the procedure step that matches this technique ID
      const matchingProcedureSteps = this.study.procedure.filter(
        step => step.technique === this.techniqueId
      )
      // Ensure there should only be 1
      if (matchingProcedureSteps.length !== 1) {
        console.error(`Expected 1 matching procedure step, found ${matchingProcedureSteps.length}`)
      }

      return matchingProcedureSteps[0].description
    }
  }
}
</script>
