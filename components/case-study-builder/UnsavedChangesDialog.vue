<template>
  <v-dialog v-model="doShowSavePromptDialog" width="500">
    <v-card>
      <v-card-title> Unsaved changes </v-card-title>

      <v-card-text>
        <div class="content">
          You have unsaved changes.
          <v-spacer />
          Continue submission without including changes?
        </div>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          class="ma-1"
          color="grey"
          text
          @click="clickFromUnsaved('return')"
        >
          Return
        </v-btn>
        <v-btn
          class="ma-1"
          color="warning"
          text
          @click="clickFromUnsaved('continue')"
        >
          Continue to download
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * Dialog prompt for whether to download case study given unsaved changes.
 */
export default {
  name: 'UnsavedChangesDialog',
  props: [
    /**
     * Whether to open this dialog
     * @type {Boolean}
     */
    'showSavePromptDialog'
  ],
  data () {
    return {
      /**
       * Whether to open this dialog
       * @type {Boolean}
       */
      doShowSavePromptDialog: this.showSavePromptDialog
    }
  },
  watch: {
    showSavePromptDialog: {
      immediate: true,
      handler (newVal, oldVal) {
        this.doShowSavePromptDialog = newVal
      }
    }
  },
  methods: {
    /**
     * Handler for clicking "return" or "continue" to address unsaved changes or ignore
     * Emits which button is clicked to createstudy.vue
     * @param {string} 'return' or 'continue'
     */
    clickFromUnsaved (value) {
      this.$emit('clickFromUnsaved', value)
    }
  }
}
</script>
