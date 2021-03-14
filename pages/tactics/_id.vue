<template>
<div>
  <div class="text-h2">{{info.name}}</div>
  <p>{{info.description}}</p>
  <v-card>
    <v-card-text>
      <span class="font-weight-bold">ID:</span> {{info.id}}
    </v-card-text>
  </v-card>
</div>
</template>

<script>
export default {
  computed: {
    info () {
      return this.$store.getters.getTacticById(this.$route.params.id)
    }
  }
}
</script>
