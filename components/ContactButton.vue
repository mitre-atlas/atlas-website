<template>
  <div>
    <v-btn
      :color="color"
      dark
      large
      :href="link"
      target="_blank"
    >
      <v-icon left>
        {{ icon }}
      </v-icon>
      {{ buttonText }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ContactButton',
  props: ['color', 'icon', 'buttonText', 'link']
}
</script>
