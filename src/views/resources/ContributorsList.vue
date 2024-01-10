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
  </div>
</template>

<script setup>
  import jsyaml from 'js-yaml'
  import { ref } from 'vue'
  const { VITE_MITRE_TITLE, VITE_SHORT_NAME } = import.meta.env

  const contributors = ref([])
  console.log('contributors = ', contributors)

  fetch('/content/contributorslist.yaml')
    .then(response => response.text())
    .then(data => {
      contributors.value = jsyaml.load(data).data
    })
    .catch(error => {
      console.error('Error fetching YAML file:', error);
    });


</script>