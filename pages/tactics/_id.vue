<template>
<div>
  <breadcrumbs></breadcrumbs>
  <div class="text-h2">{{info.name}}</div>
  <div class="subtitle-1">{{info.id}}</div>
  <p>{{info.description}}</p>
  <!-- <v-card>
    <v-card-text>
      <span class="font-weight-bold">ID:</span> {{info.id}}
    </v-card-text>
  </v-card> -->

  <v-divider />

  <div class="text-h5">{{ techniques.length }} Techniques</div>
  <v-row>
    <v-col
      v-for="(technique,i) in techniques"
      :key="i"
      cols="4"
    >
      <technique-card :info="technique" />
    </v-col>
  </v-row>

</div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  components: {
    Breadcrumbs
  },
  computed: {
    info () {
      return this.$store.getters.getTacticById(this.$route.params.id)
    },
    techniques () {
      return this.$store.getters.getTechniquesByTacticId(this.$route.params.id)
    }
  }
}
</script>
