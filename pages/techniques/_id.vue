<template>
<div>
  <breadcrumbs></breadcrumbs>

  <page-title class="ml-5">{{info.name}}</page-title>

  <v-row>
    <v-col cols="8">
      <page-section-title class="ml-6">Summary</page-section-title>

      <div class="my-5 ml-10" v-html="info.description" />
    </v-col>
    <v-col cols=4>

  <v-card flat class="mt-10">
    <v-card-text>
      <p>
        <span class="font-weight-bold">ID:</span> {{info.id}}
      </p>

      <p>
        <span class="font-weight-bold">Tactics:</span>
        <span v-for="(tactic, i) in referencedTactics" :key="i">
          <span v-if="i != 0">,</span>
          <nuxt-link :to="`/tactics/${tactic.id}`">{{tactic.name}}</nuxt-link>
        </span>
      </p>

      <p v-if="'subtechnique-of' in info">
        <span class="font-weight-bold">Sub-technique of:</span>
        <nuxt-link :to="`/techniques/${parentTechnique.id}`">{{ parentTechnique.name }}</nuxt-link>
      </p>
      <p v-if="'subtechniques' in info">
        <span class="font-weight-bold" >Number of sub-techniques:</span> {{ info.subtechniques.length }}
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

  <div v-if="'subtechniques' in info">
    <v-list-group
      :value="true"
      >
      <template v-slot:activator>
        <page-section-title>
          Sub-techniques
        </page-section-title>
      </template>
        <!-- <v-badge inline :content="relevantStudies.length" /> -->
         <div
        v-for="(subtechnique,i) in info.subtechniques"
        :key="i">
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
      <template v-slot:activator>
        <page-section-title>
          Other sub-techniques
        </page-section-title>
      </template>
        <!-- <v-badge inline :content="relevantStudies.length" /> -->
         <div
        v-for="(subtechnique,i) in parentTechnique.subtechniques"
        :key="i">
        <v-list-item
          :nuxt="true"
          :to="`/techniques/${subtechnique.id}`"
          v-if="subtechnique.id !== info.id"
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

  <!--
  <div v-if="info.external_references.length > 1">
    <page-section-title text="Sources" />
    <ol class="mt-2">
      <li v-for="(ref, i) in info.external_references.slice(1)" :key="i">
        <a :href="ref.url">{{ ref.description }}</a>
      </li>
    </ol>
  </div>
  -->

</div>
</template>

<script>
export default {
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

<style scoped>
div >>> a {
  text-decoration: none;
}
</style>
