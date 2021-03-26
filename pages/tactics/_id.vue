<template>
<div>
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
export default {
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

<style scoped>

.nuxt-content {
  margin: 3rem;
}

.nuxt-content h1 {
  text-align: center;
  font-weight: bold;
}

.nuxt-content h2 {

}

.nuxt-content a {
  color: gray;
}

</style>
