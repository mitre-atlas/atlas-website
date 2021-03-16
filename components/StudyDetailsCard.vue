<template>
  <v-card>
      <v-card-text>
        <div>{{ study.id }}</div>
        <p>{{ study.date }}</p>
      </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'StudyDetailsCare',
  props: ['study']
}
</script>
