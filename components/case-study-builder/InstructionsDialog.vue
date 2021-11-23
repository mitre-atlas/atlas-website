<template>
  <v-dialog
      v-model="show"
      max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          color="secondary"
          text
        >
          <v-icon left>
            mdi-information-outline
          </v-icon>
          Instructions
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Case study considerations</v-card-title>
          <v-card-text>
          <ol>
            <li>The attack exploits one or more vulnerabilities that compromise the confidentiality, integrity, or availability of a ML system.</li>
            <li>The attack is against a production/commercial ML system. This can be on MLaaS or ML systems embedded in clients/at the edge.</li>
            <li>Ensure you have permission to share this information and/or publish this research. Please follow the proper channels before reporting a new attack and make sure you are practicing responsible disclosure.</li>
          </ol>

        </v-card-text>

        <v-divider class="mx-4"/>

        <v-card-title>How to use this case study builder</v-card-title>
        <v-card-text>

          <ol>
            <li>Fill out the form.</li>
            <!-- <ol type="a">
              <li>Details of the case study</li>
              <li>Procedure: a timeline of the incident, mapped to MITRE ATLAS&trade; and/or MITRE ATTACK<sup>&reg;</sup> Enterprise techniques</li>
              <li>An optional list of sources</li>
            </ol> -->
            <li>Download the generated case study .yaml file.</li>
            <li>Email the case study file to <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.</li>
          </ol>

          <div class="mt-2">
            After downloading the case study, a new button will appear to optionally download a PowerPoint .pptx version for perusal.
          </div>

          <div class="mt-2">
          To view or edit an existing case study, click the "Load Case Study" button and upload the .yaml file.  Make any necessary adjustments, then re-download the file.
          </div>

          <div class="mt-2">
          Please contact <a href="mailto:atlas@mitre.org">atlas@mitre.org</a> with any questions.
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            plain
            color="primary"
            @click="show = false"
            @keyup.enter="show = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'InstructionsDialog',
  props: [
    'doShow'
  ],
  data () {
    return {
      show: this.doShow
    }
  }
}
</script>
