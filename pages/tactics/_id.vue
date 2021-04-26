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
  <v-list>
    <div
      v-for="(technique,i) in techniques"
      :key="i">
      <v-list-item
        :nuxt="true"
        :to="`/techniques/${technique.id}`"
        >
        <v-list-item-title
          :class="[technique.id.startsWith('AML') ? 'teal--text text--darken-3' : '']"
          >
          {{ technique.name }}
        </v-list-item-title>
      </v-list-item>
      <div v-if="'subtechniques' in technique">
        <v-list-item
          v-for="(subtechnique, j) in technique.subtechniques"
          :key="j"
          :nuxt="true"
          :to="`/techniques/${subtechnique.id}`"
          >
          <v-list-item>
            <v-list-item-subtitle
            :class="[technique.id.startsWith('AML') ? 'teal--text text--darken-1' : '']"
            >
            {{ subtechnique.name }}
          </v-list-item-subtitle>
          </v-list-item>
        </v-list-item>
      </div>
    </div>
  </v-list>

  <div v-if="relevantStudies.length > 0">
    <page-section-title
      :text="`${relevantStudies.length} Case Studies`"
      />

    <v-list>
      <div
        v-for="(study,i) in relevantStudies"
        :key="i">
        <v-list-item
          :nuxt="true"
          :to="`/studies/${study.id}`"
          >
          <v-list-item-title>
            {{ study.name }}
          </v-list-item-title>
        </v-list-item>

      </div>
    </v-list>
  </div>

  <!--
  <v-row>
    <v-col
      v-for="(technique,i) in techniques"
      :key="i"
      cols="6"
    >
      <technique-card :info="technique" />
    </v-col>
  </v-row>
  -->
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
    },
    relevantStudies () {
      return this.$store.getters.getStudiesWhereTacticIdIn(this.$route.params.id)
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
