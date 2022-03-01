<template>
  <div>
    <v-card flat>
      <v-card-text>
        <v-row v-for="(value, key) in study" :key="key">
          <v-col cols="2" class="text-capitalize text-right font-weight-bold">
            {{ key }}
          </v-col>
          <v-col cols="10">
            <div v-if="Array.isArray(value)">
              <ol>
                <li v-for="(procObj, i) in value" :key="i" class="mb-4">
                  <div v-for="(procValue, procKey) in procObj" :key="procKey">
                    <span class="text-capitalize font-weight-medium">{{ procKey }}</span>: {{ procValue }}
                  </div>
                </li>
                <li> ... </li>
              </ol>
            </div>
            <div v-else>
              {{ value }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'CaseStudyExample',
  data: () => ({
  }),
  computed: {
    study () {
      // MITRE - Physical Adversarial Attack on Face Identification
      const exampleStudyId = 'AML.CS0012'
      const study = this.$store.getters.getStudyById(exampleStudyId)
      return {
        name: study.name,
        summary: study.summary,
        'incident-date': study['incident-date'],
        'reported-by': study['reported-by'][0],
        procedure: [
          {
            tactic: 'Reconnaissance (TA0043)',
            technique: 'Search for Victim\'s Publicly Available Research Materials (AML.T0000)',
            description: 'The team first performed reconnaissance to gather information about the target ML model.'
          },
          {
            tactic: 'Initial Access (TA0001)',
            technique: 'Valid Account (T1078)',
            description: 'The team gained access via a valid account.'
          }
        ],
        references: [
          {
            description: '(Optional) Brief description or citation',
            url: '(Optional) Link to reference URL'
          }
        ]
      }
    }
  }
}
</script>
