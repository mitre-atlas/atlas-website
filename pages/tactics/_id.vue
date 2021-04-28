<template>
<div>
  <breadcrumbs></breadcrumbs>
  <div class="text-h2 ml-6">{{info.name}}</div>
  <!-- <div class="subtitle-1">{{info.id}}</div> -->

  <v-row>
    <v-col cols="8">
      <page-section-title class="ml-7">Summary</page-section-title>

      <div class="my-5 ml-10" v-html="info.description" />
    </v-col>
    <v-col cols="4">
      <v-card flat class="mt-10">
        <v-card-text>
          <p>
            <span class="font-weight-bold">ID:</span> {{info.id}}
          </p>

          <p>
            <span class="font-weight-bold">Techniques:</span> {{ numTotalTechniques }}
          </p>

          <p>
            <span class="font-weight-bold">Case studies:</span> {{ relevantStudies.length }}
          </p>

          <span v-if="info.id.startsWith('T')">
            <a href='#' @click="openNewTab">View at MITRE ATT&CK</a>
            <v-icon small>mdi-open-in-new</v-icon>
          </span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- <v-divider /> -->

  <v-expansion-panels multiple flat accordion>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div class="text-h5">Techniques</div>
      </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <div
              v-for="(technique,i) in techniques"
              :key="i">
              <v-list-item
                :nuxt="true"
                :to="`/techniques/${technique.id}`"
                >
                <v-list-item-title
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
                    >
                    {{ subtechnique.name }}
                  </v-list-item-subtitle>
                  </v-list-item>
                </v-list-item>
              </div>
            </div>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel-header>
    </v-expansion-panel>

    <v-expansion-panel v-if="relevantStudies.length > 0">
      <v-expansion-panel-header>
        <div class="text-h5">Case studies</div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
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
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>

  <!-- <page-section-title>{{ numTotalTechniques }} Techniques</page-section-title>
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
  </v-list> -->

  <!-- <div v-if="relevantStudies.length > 0">
    <page-section-title>{{ relevantStudies.length }} Case Studies</page-section-title>

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
  </div> -->

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
    },
    numTotalTechniques () {
      let count = 0
      this.techniques.forEach((t) => {
        count += 1
        if ('subtechniques' in t) {
          count += t.subtechniques.length
        }
      })
      return count
    }
  },
  methods: {
    openNewTab () {
      const url = this.info.external_references[0].url
      window.open(url, '_blank')
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
