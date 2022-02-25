<template>
  <v-card>
    <v-card-title>
      {{ info.name }}
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
        color="deep-orange accent-4"
        text
        :href="`/techniques/$info.id}`"
      >
        Learn more
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider />
        <v-card-subtitle>
          {{ info.id }}
        </v-card-subtitle>
        <v-card-text v-html="info.description" />
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: 'TechniqueCard',
  props: ['info'],
  data: () => ({
    show: false
  })
}
</script>
