<template>
  <v-dialog v-model="show" max-width="500px" @input="scrollToTop">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="secondary" text v-on="on">
        <v-icon left>
          mdi-information-outline
        </v-icon>
        Instructions
      </v-btn>
    </template>
    <v-card class="tw-prose">
      <v-card-title id="top" style="word-break: break-word">
        Case study considerations
      </v-card-title>
      <v-card-text>
        <ol>
          <li>
            The attack exploits one or more vulnerabilities that compromise the
            confidentiality, integrity, or availability of an AI system.
          </li>
          <li>
            The attack is against a production/commercial AI system. This can be
            on MLaaS or AI systems embedded in clients/at the edge.
          </li>
          <li>
            Ensure you have permission to share this information and/or publish
            this research. Please follow the proper channels before reporting a
            new attack and make sure you are practicing responsible disclosure.
          </li>
        </ol>
      </v-card-text>

      <v-card-title style="word-break: break-word">
        How to use this case study builder
      </v-card-title>
      <v-card-text>
        <ol>
          <li>Fill out the form.</li>
          <li>Download the generated case study .yaml file.</li>
          <li>
            Email the case study file to
            <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
          </li>
        </ol>

        <p>
          After downloading the case study, a new button will appear to
          optionally download a PowerPoint .pptx version for perusal.
        </p>

        <p>
          To view or edit an existing case study, click the "Load Case Study"
          button and upload the .yaml file. Make any necessary adjustments, then
          re-download the file.
        </p>

        <p>
          For more guidance, please watch this
          <a
            target="_blank"
            href="https://www.youtube.com/watch?v=Np_ip14YJGg&list=PLkTApXQou_8J6-t2_7QTTVDLBQlKFXPOu&index=2"
          >instructional video</a>.
        </p>

        <p>
          Please contact
          <a href="mailto:atlas@mitre.org">atlas@mitre.org</a> with any
          questions.
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          plain
          color="primary"
          @click="scrollToTop(false)"
          @keyup.enter="scrollToTop(false)"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
/**
 * Popup with instructions for how to use the case study builder
 */
export default {
  name: 'InstructionsDialog',
  data () {
    return {
      /**
       * Whether the dialog is open
       * @type {Booleam}
       */
      show: false
    }
  },
  methods: {
    /**
     * Ensures the dialog always opens at the top
     * @param {Boolean} show
     */
    scrollToTop (show) {
      if (!show) {
        document.getElementById('top').scrollIntoView()
        this.show = show
      }
    }
  }
}
</script>
