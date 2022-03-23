<template>
  <div>
    <v-card flat>
      <v-card-text>
        <div v-html="$md.render(studyMd)" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import yaml from 'js-yaml'

export default {
  name: 'CaseStudyExample',
  data: () => ({
  }),
  computed: {
    studyMd () {
      // MITRE - Physical Adversarial Attack on Face Identification
      const exampleStudyId = 'AML.CS0012'
      // Shallow copy retrieved object
      const study = { ...this.$store.getters.getStudyById(exampleStudyId) }

      // Remove elements that wouldn't be part of a built file
      delete study.id
      delete study['object-type']
      // Trim down to date
      study['incident-date'] = study['incident-date'].toISOString().substring(0, 10)

      return '```yaml\n' + yaml.dump(study) + '```'
    }
  }
}
</script>
