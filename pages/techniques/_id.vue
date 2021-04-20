<template>
<div class="content-container">
  <div class="side-menu-container">
    <side-menu contentType="techniques"></side-menu>
  </div>
  <div class="info-container">
    <breadcrumbs></breadcrumbs>
    <div class="text-h2">{{info.name}}</div>
    <p>{{info.description}}</p>

    <v-card>
      <v-card-text>
        <span class="font-weight-bold">ID:</span> {{info.id}}

        <p v-if="'subtechnique-of' in info">
          <span class="font-weight-bold">Sub-technique of:</span>
          <nuxt-link :to="`/techniques/${parentTechnique.id}`">{{ parentTechnique.name }}</nuxt-link>
        </p>

        <p>
          <span class="font-weight-bold">Tactics:</span>
          <span v-for="(tactic, i) in referencedTactics" :key="i">
            <nuxt-link :to="`/tactics/${tactic.id}`">{{tactic.name}}</nuxt-link>
          </span>
        </p>
      </v-card-text>
    </v-card>
  </div>
</div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import SideMenu from '@/components/SideMenu'

export default {
  components: {
    Breadcrumbs,
    SideMenu
  },
  computed: {
    info () {
      return this.$store.getters.getTechniqueById(this.$route.params.id)
    },
    parentTechnique () {
      const fullId = this.info['subtechnique-of']
      return this.$store.getters.getTechniqueWhereIdIn(fullId)
    },
    referencedTactics () {
      return this.info.tactics.map((fullId) => {
        return this.$store.getters.getTacticWhereIdIn(fullId)
      })
    }
  }
}
</script>
