<template>
<div>
  <v-card flat color="light-blue lighten-5">
    <v-card-title>{{ title }} </v-card-title>
    <v-card-text>
      <p>
        {{ description }}
      </p>
      <p>
        For more information, contact <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
      </p>
    </v-card-text>
  </v-card>
</div>
</template>
<script>
export default {
  name: 'Annoucement',
  data: () => ({
    title: '',
    description: '',
    contactEmail: 'atlas@mitre.org'
  })
}
</script>
