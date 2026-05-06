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
            <li v-for="consideration in caseStudyConsiderations" :key="consideration">
              {{ consideration }}
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

<script setup>
import {
  caseStudyConsiderations as caseStudySpecificConsiderations,
  getResponsibleDisclosureConsideration,
} from '@/assets/contributionTools'

const caseStudyConsiderations = [
  ...caseStudySpecificConsiderations,
  getResponsibleDisclosureConsideration('case study'),
]
</script>

<style scoped>
li {
  margin-bottom: 1em;
}
</style>
