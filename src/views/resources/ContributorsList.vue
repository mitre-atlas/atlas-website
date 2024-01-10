<template>
  <div class="text-left pt-10 pr-12 pl-12 pb-10">
    <p class="text-h3 mt-10">
      Contribute
    </p>
    <p>
      {{ VITE_MITRE_TITLE }} is a first-cut attempt at collating a knowledge base of how ML systems
      can be attacked. We need your help to make it holistic and fill in the missing gaps!
    </p>
    <p class="text-h5 mt-10">
      Corrections and Improvement
    </p>
    <p>
      For immediate corrections to tactics, techniques, and case studies, please email 
      <a href="mailto:atlas@mitre.org">atlas@mitre.org</a> or 
      <a href="https://join.slack.com/t/mitreatlas/shared_invite/zt-10i6ka9xw-~dc70mXWrlbN9dfFNKyyzQ" target="_blank">join MITRE ATLAS on Slack</a> 
      and post on the <a href="https://slack.com/app_redirect?team=T02RY3VGBPS&channel=C03745F7LDQ" target="_blank">#feedback-and-recommendations</a> channel.
    </p>
    <p class="text-h5 mt-10">
      Contribute Case Studies
    </p>
    <p>
      We are especially excited for new case-studies! We look forward to contributions from both
      industry and academic researchers.
    </p>
    <p>
      Use the Case Study Builder to craft a submission file with details and technique mappings,
      then email the file to <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
      The {{ VITE_SHORT_NAME }} team will review the submission and follow up with feedback.
    </p>
    <v-btn to="/studies/create">
      Go to Case Study Builder
    </v-btn>
    <p class="text-h5 mt-10">
      Contributors
    </p>
    <p>
      Thank you to our many active contributors! Including, but not limited to:
    </p>
    <v-row v-if="!smAndDown">
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(item, i) in contributorsA"
            :key="i"
            :title="item.organization"
          >
            <v-expansion-panel-text v-for="(name, i) in item.contributors" :key="i" class="text-caption">
              {{ name }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(item, i) in contributorsB"
            :key="i"
            :title="item.organization"
          >
            <v-expansion-panel-text v-for="(name, i) in item.contributors" :key="i" class="text-caption">
              {{ name }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(item, i) in contributors"
          :key="i"
          :title="item.organization"
        >
          <v-expansion-panel-text v-for="(name, i) in item.contributors" :key="i" class="text-caption">
            {{ name }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script setup>
  import jsyaml from 'js-yaml'
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'

  const { smAndDown } = useDisplay()

  const { VITE_MITRE_TITLE, VITE_SHORT_NAME } = import.meta.env

  const contributors = ref([])
  const contributorsA = ref([])
  const contributorsB = ref([])

  fetch('/content/contributorslist.yaml')
    .then(response => response.text())
    .then(data => {
      const contents = jsyaml.load(data)

      // Sort contributors alphabetically
      contributors.value = contents.data.map((c) => {
        c.contributors.sort()
        return c
      })

      // Sort by organization name
      contributors.value.sort((a, b) => (a.organization > b.organization) ? 1 : ((a.organization < b.organization) ? -1 : 0))

      // Split into two columns
      const splitIndex = Math.ceil(contributors.value.length / 2)
      contributorsA.value = contributors.value.slice().splice(0, splitIndex)
      contributorsB.value = contributors.value.slice().splice(splitIndex, contributors.value.length)

    })
    .catch(error => {
      console.error('Error fetching YAML file:', error);
    });


</script>