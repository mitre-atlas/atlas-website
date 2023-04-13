<template>
  <div class="container fill-height">
    <v-row class="text-center">
      <v-col>
        <div v-if="error.statusCode === 404" class="text-h5">
          Page not found
        </div>

        <div v-else>
          An error occurred
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-btn href="https://atlas.mitre.org" class="mx-auto">
        Back to Home
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>
