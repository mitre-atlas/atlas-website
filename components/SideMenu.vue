<template>
  <v-navigation-drawer
    app
    clipped
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
        >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>
              {{ item.name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-list>

    <v-expansion-panels
      v-else
      accordion
      flat
      multiple
    >
      <v-expansion-panel
        v-for="(tactic, i) in this.getTactics"
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

            <!-- <v-expansion-panel-header
              v-else
              hide-actions
            >
              <NuxtLink
                :to="`/techniques/${technique.id}`"
                style="text-decoration: none;"
              >
                {{ technique.name }}
              </NuxtLink>
            </v-expansion-panel-header> -->
            <div v-else class="mb-3 ml-6" style="line-height: 1;">
              <!-- <v-btn
                text
                @click="$vuetify.goTo(`${technique.id}`)"
                >
                {{ technique.name }}
                </v-btn> -->
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

    <!--
    <v-list dense nav v-else>
      <v-list-group
        :value="true"
        v-for="(tactic, i) in this.getTactics"
        :key="i"
      >
        <template v-slot:activator>
          <v-list-item-title>
            {{ tactic.name }}
          </v-list-item-title>
        </template>

        <div
          v-for="(technique, j) in tactic.techniques"
          :key="j"
        >

          <v-list-group
            v-if="'subtechniques' in technique"
            :value="true"
            no-action
            sub-group
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ technique.name }}
                </v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="(subtechnique, k) in technique.subtechniques"
              :key="k"
            >
              <v-list-item-title>
                {{ subtechnique.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-item v-else>
            <v-list-item-title>
              {{ technique.name }}
            </v-list-item-title>
            </v-list-item>
        </div>
      </v-list-group>
    </v-list>
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
    ...mapGetters(['getTactics', 'getTechniques', 'getStudies']),
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
        return this.getTactics
      } else if (this.$route.name.startsWith('techniques')) {
        return this.getTechniques
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
.v-list-item__subtitle {
  white-space: normal;
}
</style>
