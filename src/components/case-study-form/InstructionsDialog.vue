<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        text="Instructions"
        prepend-icon="mdi-information-outline"
        color="grey-lighten-2"
      />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title> Case study considerations </v-card-title>
        <v-card-text class="text-subtitle-2 text-grey-darken-1">
          <ol>
            <li>
              The attack exploits one or more vulnerabilities that compromise the confidentiality,
              integrity, or availability of a ML system.
            </li>
            <li>
              The attack is against a production/commercial ML system. This can be on MLaaS or ML
              systems embedded in clients/at the edge.
            </li>
            <li>
              Ensure you have permission to share this information and/or publish this research.
              Please follow the proper channels before reporting a new attack and make sure you are
              practicing responsible disclosure.
            </li>
          </ol>
        </v-card-text>

        <v-card-title> How to use this case study builder </v-card-title>
        <v-card-text class="text-subtitle-2 text-grey-darken-1">
          <ol>
            <li>Fill out the form.</li>
            <li>Download the generated case study .yaml file.</li>
            <li>
              Email the case study file to
              <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
            </li>
          </ol>

          <p>
            After downloading the case study, a new button will appear to optionally download a
            PowerPoint .pptx version for perusal.
          </p>

          <p>
            To view or edit an existing case study, click the "Load Case Study" button and upload
            the .yaml file. Make any necessary adjustments, then re-download the file.
          </p>

          <p>
            For more guidance, please watch this
            <a
              target="_blank"
              href="https://www.youtube.com/watch?v=Np_ip14YJGg&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=2"
              >instructional video</a
            >.
          </p>

          <p>
            Please contact
            <a href="mailto:atlas@mitre.org">atlas@mitre.org</a> with any questions.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text="Ok" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
li {
  margin-bottom: 1em;
}
</style>
