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
            <span class="font-weight-bold">Number of techniques:</span> {{ numTotalTechniques }}
          </p>

          <p>
            <span class="font-weight-bold">Number of case studies:</span> {{ relevantStudies.length }}
          </p>

          <span v-if="info.id.startsWith('T')">
            <a @click="openNewTab">View at MITRE ATT&CK</a>
            <v-icon small>mdi-open-in-new</v-icon>
          </span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- <v-divider /> -->

  <div>
    <v-list-group
      :value="true"
      >
      <template v-slot:activator>
        <page-section-title>
          Techniques
        </page-section-title>
      </template>
        <!-- <v-badge inline :content="relevantStudies.length" /> -->
      <div
        v-for="(technique,i) in techniques"
        :key="i">
        <v-list-item
          :nuxt="true"
          :to="`/techniques/${technique.id}`"
          >
          <v-list-item>
            <v-list-item-title>
              {{ technique.name }}
            </v-list-item-title>
            <v-list-item-icon v-if="technique.id.startsWith('T')" class="red--text text--darken-3 text-caption">
                  &
              </v-list-item-icon>
          </v-list-item>
        </v-list-item>
        <div v-if="'subtechniques' in technique">
          <v-list-item
            v-for="(subtechnique, j) in technique.subtechniques"
            :key="j"
            :nuxt="true"
            :to="`/techniques/${subtechnique.id}`"
            >
            <v-list-item>

                <v-list-item-subtitle class="pl-3">
                {{ subtechnique.name }}
                </v-list-item-subtitle>
                <v-list-item-icon v-if="subtechnique.id.startsWith('T')" class="red--text text--darken-3 text-caption">
                    &
                </v-list-item-icon>
              </v-list-item>

          </v-list-item>
        </div>
      </div>
    </v-list-group>
  </div>

  <div v-if="relevantStudies.length > 0">
    <v-list-group
      :value="true"
      >
      <template v-slot:activator>
        <page-section-title>
          Case studies
        </page-section-title>
        <!-- <v-badge inline :content="relevantStudies.length" /> -->
      </template>

      <div
        v-for="(study,i) in relevantStudies"
        :key="i">
        <v-list-item
          :nuxt="true"
          :to="`/studies/${study.id}`"
          >
          <v-list-item>
            <v-list-item-title>
              {{ study.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item>
      </div>
    </v-list-group>
  </div>

</div>
</template>

<script>
export default {
  head () {
    return {
      title: this.$store.getters.getTacticById(this.$route.params.id).name + ', Tactic: ' + this.$route.params.id + ` | ${this.$config.name.mitre}`
    }
  },
  computed: {
    info () {
      return this.$store.getters.getTacticById(this.$route.params.id)
    },
    techniques () {
      return this.$store.getters.getFilteredTechniquesByTacticId(this.$route.params.id)
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
