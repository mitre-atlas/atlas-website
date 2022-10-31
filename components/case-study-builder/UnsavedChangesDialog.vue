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
          @click="clickReturn"
        >
          Return
        </v-btn>
        <v-btn
          class="ma-1"
          color="warning"
          text
          @click="clickDownload"
        >
          Continue to download
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UnsavedChangesDialog',
  props: [
    'showSavePromptDialog'
  ],
  data () {
    return {
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
    submitForm (newVal) {
      this.$emit('submitForm', newVal)
    },
    clickReturn (newVal) {
      this.doShowSavePromptDialog = false
      this.$emit('clickReturn', this.doShowSavePromptDialog)
    },
    clickDownload (newVal) {
      this.doShowSavePromptDialog = false
      this.$emit('clickDownload', this.doShowSavePromptDialog)
    }
  }
}
</script>
