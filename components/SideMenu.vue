<template>
  <v-navigation-drawer
    app
    absolute
    clipped
    style="height: calc(100% - 170px)"
    >
    <v-list-item class="mt-10">
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list dense nav v-if="title === 'Tactics' || title === 'Case Studies'">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :nuxt="true"
        :to="`/${basePath}/${item.id}`"
        :ripple="false"
        >
        <v-list-item>
          <v-list-item-content class="blue--text text--darken-2" style="font-size: 0.9375rem;">
            <!-- Font size and color to match v-expansion-panel-header style
            class="blue--text text--darken-2" style="font-size: 0.9375rem;" -->
            {{ item.name }}

          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-list>

    <v-list
      v-else-if="title === 'Techniques'"
      dense
      nav
    >
      <v-list-group
        v-for="(tactic, i) in items"
        :key="i"
        no-action
      >
        <template v-slot:activator>
          <v-list-item v-if="tactic.techniques.length > 0">
            <NuxtLink
              :to="`/tactics/${tactic.id}`"
              style="text-decoration: none; font-size: 0.9375rem;"
            >
              <!-- Smaller font size, similar to v-expansion-panel-header -->
              {{ tactic.name }}
            </NuxtLink>
          </v-list-item>
        </template>

        <div
            v-for="(technique, j) in tactic.techniques"
            :key="j"
          >
          <v-list-item
            :nuxt="true"
            :to="`/${basePath}/${technique.id}`"
            :ripple="false"
            >
              <v-list-item>
                <v-list-item>
              <v-list-item-title style="font-weight: 400;">
                <!-- Font size and color to match v-expansion-panel-header style -->
                {{ technique.name }}
              </v-list-item-title>
              <v-list-item-icon v-if="technique.id.startsWith('T')" class="red--text text--darken-3 text-caption">
                  &
              </v-list-item-icon>
              </v-list-item>
              </v-list-item>
          </v-list-item>

            <v-list-item
              v-for="(subtechnique, k) in technique.subtechniques"
              :key="k"
              :nuxt="true"
              :to="`/${basePath}/${subtechnique.id}`"
              :ripple="false"
            >
            <v-list-item>
              <!-- <v-list-item> -->
            <v-list-item>
              <v-list-item-title class="pl-3" style="font-weight: 400;">
                {{ subtechnique.name }}
              </v-list-item-title >
              <v-list-item-icon v-if="technique.id.startsWith('T')" class="red--text text--darken-3 text-caption">
                  &
              </v-list-item-icon>
            </v-list-item>
              <!-- </v-list-item> -->
            </v-list-item>
            </v-list-item>

        </div>
      </v-list-group>
    </v-list>
<!--
    <v-expansion-panels
      v-else
      accordion
      flat
      multiple
      hover
      style="z-index: 0"
    >

      <v-expansion-panel
        v-for="(tactic, i) in items"
        :key="i"
      >
        <v-expansion-panel-header>
          <NuxtLink
            :to="`/tactics/${tactic.id}`"
            style="text-decoration: none;"
          >
            {{ tactic.name }}
          </NuxtLink>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <div
            v-for="(technique, j) in tactic.techniques"
            :key="j"
          >

            <v-expansion-panels
              v-if="'subtechniques' in technique"
              accordion
              flat
              multiple
              hover
            >
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <NuxtLink
                      :to="`/techniques/${technique.id}`"
                      style="text-decoration: none; font-size: 0.9375rem;"
                    >
                    {{ technique.name }}
                  </NuxtLink>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-expansion-panel-header
                    hide-actions
                    v-for="(subtechnique, k) in technique.subtechniques"
                    :key="k"
                  >
                    <NuxtLink
                        :to="`/techniques/${subtechnique.id}`"
                        style="text-decoration: none; font-size: 0.9375rem;"
                      >
                      {{ subtechnique.name }}
                    </NuxtLink>
                  </v-expansion-panel-header>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <div v-else class="mb-3 ml-6" style="line-height: 1;">

              <NuxtLink
                  :to="`/techniques/${technique.id}`"
                  style="text-decoration: none; font-size: 0.9375rem;"
                >
                {{ technique.name }}
              </NuxtLink>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
-->
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['getTactics', 'getTechniques', 'getStudies', 'getTechniquesByTacticId', 'getFilteredTechniquesByTacticId', 'getFilteredTactics']),
    title () {
      if (this.$route.name.startsWith('tactics')) {
        return 'Tactics'
      } else if (this.$route.name.startsWith('techniques')) {
        return 'Techniques'
      } else {
        return 'Case Studies'
      }
    },
    items () {
      if (this.$route.name.startsWith('tactics')) {
        return this.getFilteredTactics
      } else if (this.$route.name.startsWith('techniques')) {
        // Hierarchy of tactics with fully populated techniques
        return this.getFilteredTactics.map((tactic) => {
          return {
            ...tactic,
            techniques: this.getFilteredTechniquesByTacticId(tactic.id)
          }
        })
      } else {
        return this.getStudies
      }
    },
    basePath () {
      // i.e. tactics, techniques, studies
      return this.$route.path.split('/')[1]
    }
  },
  methods: {
    scrollTo (elementId) {
      this.$emit('scroll-to', elementId)
    }
  },
  watch: {
    // TODO Only refresh when needed
    // '$route.name' (to, from) {
    //   console.log(to, from)
    //   if (this.$route.name.startsWith('tactics')) {
    //     this.title = 'Tactics'
    //     this.items = this.$store.getters.getTactics
    //   } else if (this.$route.name.startsWith('techniques')) {
    //     this.title = 'Techniques'
    //     this.items = this.$store.getters.getTechniques
    //   } else {
    //     this.title = 'Case Studies'
    //     this.items = this.$store.getters.getStudies
    //   }
    // }
  }
}
</script>

<style scoped>
.v-list-item__title {
  white-space: normal;
}
.v-list-item__subtitle {
  white-space: normal;
}
</style>
