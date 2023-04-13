<!-- Navigation dialog -->
<template>
  <v-card>
    <v-card-title>
      Leave Site?
    </v-card-title>

    <v-card-text>
      <div class="content">
        Are you sure you want to leave this page?
        <v-spacer />
        You will lose all changes.
      </div>
      <slot />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn class="ma-1" color="grey" text @click="$emit('close')">
        Stay on this Page
      </v-btn>
      <v-btn class="ma-1" color="error" text @click="$emit('leave-page')">
        Leave this Page
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
/**
 * Dialog that opens before navigating away from the case study builder.
 */
export default {
  name: 'NavigationDialog',
  props: {
    value: Boolean
  },
  watch: {
    /**
     * Watches to see if the dialog is showing or not
     */
    value (val) {
      if (val) {
        this.$refs.dialog.show()
      } else {
        this.$refs.dialog.close()
      }
    }
  }
}
</script>
<style scoped>
.v-card {
  z-index: 4000;
}
</style>
