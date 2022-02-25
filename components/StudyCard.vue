<template>
  <v-card>
    <v-card-title>
      {{ study.name }}
    </v-card-title>
    <v-card-actions>
      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

      <v-spacer />

      <v-btn
        color="teal accent-4"
        text
        :href="`/studies/${study.id}`"
      >
        Learn more
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider />
        <v-card-subtitle>
          {{ study.id }}
        </v-card-subtitle>
        <v-card-text>
          {{ study.summary }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: 'StudyCard',
  props: ['study'],
  data: () => ({
    show: false
  })
}
</script>
