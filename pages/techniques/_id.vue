<template>
  <div>
    <div class="mx-8">
      <breadcrumbs />
      <span v-if="'subtechnique-of' in info">
        <page-title>{{ parentTechnique.name }}: {{ info.name }}</page-title>
      </span>
      <span v-else>
        <page-title>{{ info.name }}</page-title>
      </span>
      <v-row>
        <v-col cols="8">
          <page-section-title>
            Summary
          </page-section-title>
          <v-list-item>
            <div v-html="$md.render(info.description)" />
          </v-list-item>
        </v-col>
        <v-col cols="4">
          <v-card flat class="mt-10">
            <v-card-text>
              <p>
                <span class="font-weight-bold">ID:</span> {{ info.id }}
              </p>

              <p>
                <span class="font-weight-bold">Tactics:</span>
                <span v-for="(tactic, i) in referencedTactics" :key="i">
                  <span v-if="i != 0">,</span>
                  <nuxt-link :to="`/tactics/${tactic.id}`">{{ tactic.name }}</nuxt-link>
                </span>
              </p>

              <p v-if="'subtechnique-of' in info">
                <span class="font-weight-bold">Sub-technique of:</span>
                <nuxt-link :to="`/techniques/${parentTechnique.id}`">
                  {{ parentTechnique.name }}
                </nuxt-link>
              </p>
              <p v-if="'subtechniques' in info">
                <span class="font-weight-bold">Number of sub-techniques:</span> {{ info.subtechniques.length }}
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
    </div>

    <div v-if="'subtechniques' in info">
      <v-list-group
        :value="true"
      >
        <template #activator>
          <page-section-title>
            Sub-techniques
          </page-section-title>
        </template>
        <!-- <v-badge inline :content="relevantStudies.length" /> -->
        <div
          v-for="(subtechnique,i) in info.subtechniques"
          :key="i"
        >
          <v-list-item
            :nuxt="true"
            :to="`/techniques/${subtechnique.id}`"
          >
            <v-list-item>
              <v-list-item-title>
                {{ subtechnique.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item>
        </div>
      </v-list-group>
    </div>

    <div v-if="'subtechnique-of' in info">
      <v-list-group
        :value="true"
      >
        <template #activator>
          <page-section-title>
            Other sub-techniques
          </page-section-title>
        </template>
        <!-- <v-badge inline :content="relevantStudies.length" /> -->
        <div
          v-for="(subtechnique,i) in parentTechnique.subtechniques"
          :key="i"
        >
          <v-list-item
            v-if="subtechnique.id !== info.id"
            :nuxt="true"
            :to="`/techniques/${subtechnique.id}`"
          >
            <v-list-item>
              <v-list-item-title>
                {{ subtechnique.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item>
        </div>
      </v-list-group>
    </div>

    <div v-if="relevantStudies.length > 0">
      <v-list-group
        :value="true"
      >
        <template #activator>
          <page-section-title>
            Case study examples
          </page-section-title>
        </template>

        <v-list three-line>
          <div
            v-for="(study,i) in relevantStudies"
            :key="i"
          >
            <v-list-item
              :nuxt="true"
              :to="`/studies/${study.id}`"
            >
              <case-study-procedure-example :study="study" :technique-id="info.id" />
            </v-list-item>
          </div>
        </v-list>
      </v-list-group>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: this.$store.getters.getTechniqueById(this.$route.params.id).name + ', Technique: ' + this.$route.params.id + ' | MITRE ATLAS'
    }
  },
  computed: {
    info () {
      return this.$store.getters.getTechniqueById(this.$route.params.id)
    },
    parentTechnique () {
      const fullId = this.info['subtechnique-of']
      return this.$store.getters.getTechniqueById(fullId)
    },
    referencedTactics () {
      let tacticsList = []
      if ('tactics' in this.info) {
        // This is a parent technique
        tacticsList = this.info.tactics
      } else {
        // This is a subtechnique
        // Subtechnique ID is the parent technique ID.XYZ
        const parentId = this.info.id.substring(0, this.info.id.lastIndexOf('.'))
        // Lookup referenced tactics from its parent
        const parentTechnique = this.$store.getters.getTechniqueById(parentId)
        tacticsList = parentTechnique.tactics
      }

      // Return the list of tactics
      return tacticsList.map((fullId) => {
        return this.$store.getters.getTacticById(fullId)
      })
    },
    relevantStudies () {
      return this.$store.getters.getStudiesWhereTechniqueIdIn(this.$route.params.id)
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
