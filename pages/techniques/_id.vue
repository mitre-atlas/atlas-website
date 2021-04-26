<template>
<div>
  <breadcrumbs></breadcrumbs>
  <div class="text-h2">{{info.name}}</div>
  <div v-html="info.description" />

  <v-card>
    <v-card-text>
      <p>
        <span class="font-weight-bold">ID:</span> {{info.id}}
      </p>

      <p v-if="'subtechnique-of' in info">
        <span class="font-weight-bold">Sub-technique of:</span>
        <nuxt-link :to="`/techniques/${parentTechnique.id}`">{{ parentTechnique.name }}</nuxt-link>
      </p>

      <p>
        <span class="font-weight-bold">Tactics:</span>
        <span v-for="(tactic, i) in referencedTactics" :key="i">
          <span v-if="i != 0">,</span>
          <nuxt-link :to="`/tactics/${tactic.id}`">{{tactic.name}}</nuxt-link>
        </span>
      </p>

      <span>
      <a href='#' @click="openNewTab">MITRE ATT&CK</a>
      <v-icon small>mdi-open-in-new</v-icon>
      </span>
    </v-card-text>
  </v-card>

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
      return this.$store.getters.getTechniqueWhereIdIn(fullId)
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
        return this.$store.getters.getTacticWhereIdIn(fullId)
      })
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
