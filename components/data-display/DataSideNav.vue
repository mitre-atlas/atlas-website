<template>
  <v-navigation-drawer
    v-model="doShowNavDrawer"
    clipped
    app
    style="z-index: 3000"
    :width="325"
    :temporary="isDrawerTemporary"
  >
    <v-list-item class="mt-10">
      <v-list-item-content>
        <v-list-item-title class="title text-capitalize">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- Sidebar for TECHNIQUES---------------------------------------------------------------------->

    <v-list v-if="title === 'techniques'" dense nav>
      <v-list-group
        v-for="(tacticObjects, matrixID, i) in $store.state.data.objects
          .tactics"
        :key="i"
        no-action
        :value="isTechniqueInMatrix(tacticObjects, i)"
      >
        <template #activator>
          <v-list-item>
            <NuxtLink
              :to="`/matrices/${matrixID}`"
              style="font-size: 0.9375rem"
              @click.native="closeTemporaryDrawer"
            >
              <!-- Smaller font size, similar to v-expansion-panel-header -->
              {{ matrixID }}
            </NuxtLink>
          </v-list-item>
        </template>

        <!-- The value prop below keeps the dropdown list unfolded based on the currently active/selected technique -->
        <v-list-group
          v-for="(tactic, j) in tacticObjects"
          :key="j"
          no-action
          sub-group
          :value="isTacticInTechnique(tactic.id)"
        >
          <template #activator>
            <v-list-item>
              <v-list-item>
                <NuxtLink
                  :to="tactic.route"
                  style="font-size: 0.9375rem"
                  @click.native="closeTemporaryDrawer"
                >
                  <!-- Smaller font size, similar to v-expansion-panel-header -->
                  {{ tactic.name }}
                </NuxtLink>
              </v-list-item>
            </v-list-item>
          </template>

          <div v-for="(technique, k) in tactic.techniques" :key="k">
            <v-list-item :nuxt="true" :to="technique.route" :ripple="false">
              <v-list-item @click="closeTemporaryDrawer">
                <v-list-item-title style="font-weight: 400" class="text-wrap">
                  <!-- Font size and color to match v-expansion-panel-header style -->
                  {{ technique.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list-item>

            <v-list-item
              v-for="(subtechnique, l) in technique.subtechniques"
              :key="l"
              :nuxt="true"
              :to="subtechnique.route"
              :ripple="false"
            >
              <v-list-item>
                <v-list-item @click="closeTemporaryDrawer">
                  <v-list-item-title
                    class="pl-1 text-wrap"
                    style="font-weight: 400"
                  >
                    {{ subtechnique.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item>
            </v-list-item>
          </div>
        </v-list-group>
      </v-list-group>
    </v-list>

    <!-- Sidebar for TACTICS --------------------------------------------------->

    <v-list v-else-if="title === 'tactics'" dense nav>
      <v-list-group
        v-for="(tacticObjects, matrixID, i) in $store.state.data.objects
          .tactics"
        :key="i"
        no-action
        :value="isTacticInMatrix(tacticObjects, matrixID, i)"
      >
        <template #activator>
          <v-list-item>
            <NuxtLink
              :to="`/matrices/${matrixID}`"
              style="font-size: 0.9375rem"
              @click.native="closeTemporaryDrawer"
            >
              <!-- Smaller font size, similar to v-expansion-panel-header -->
              {{ matrixID }}
            </NuxtLink>
          </v-list-item>
        </template>

        <div v-for="(tactic, j) in tacticObjects" :key="j">
          <v-list-item :nuxt="true" :to="tactic.route" :ripple="false">
            <v-list-item>
              <v-list-item @click="closeTemporaryDrawer">
                <v-list-item-title>
                  {{ tactic.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list-item>
          </v-list-item>
        </div>
      </v-list-group>
    </v-list>

    <!-- Sidebar for every other ENTITY--------------------------------------------------->

    <v-list v-else dense nav>
      <v-list-item
        v-for="(item, i) in navItems"
        :key="i"
        :nuxt="true"
        :to="item.route"
        :ripple="false"
      >
        <v-list-item>
          <v-list-item-content
            class="blue--text text--darken-2"
            style="font-size: 0.9375rem"
          >
            <!-- Font size and color to match v-expansion-panel-header style -->
            {{ item.name }}
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

export default {
  name: 'DataSideNav',
  data () {
    return {
      placeholderTitle: 'Placeholder Title',
      footer: null,
      observer: null,
      fal: false,
      tacticsList: null
    }
  },
  computed: {
    navItems () {
      return this.$store.state.navDrawerItems
    },
    title () {
      // if (this.navItems && this.navItems.length > 0 && !this.fixedTitle) {
      if (this.navItems && this.navItems.length > 0) {
        // Plural object type with spaces instead of dashes, if any
        return dataObjectToPluralTitle(this.navItems[0])
      }
      // Otherwise use the specified title, or the default placeholder
      // return this.fixedTitle ?? this.placeholderTitle
      return this.placeholderTitle
    },
    ...mapGetters(['getDataObjectById']),
    currentTechniqueRouteID () {
      return this.$route.path
        .split('/')
        .slice(1)
        .filter(e => !!e) // '/this/is/path' -> ['this', 'is', 'path']
    },
    doShowNavDrawer: {
      get () {
        return this.$store.state.doShowNavDrawer
      },
      set (value) {
        this.setNavDrawer(value)
      }
    },
    isDrawerTemporary () {
      return this.doShowNavDrawer && this.$vuetify.breakpoint.mobile
    },
    headerHeight () {
      return this.$vuetify.application.top
    }
  },

  watch: {
    '$vuetify.breakpoint.mobile' (isMobile) {
      if (isMobile && this.doShowNavDrawer) {
        // Close drawer when going to mobile with it open
        this.doShowNavDrawer = false
      }
    }
  },

  mounted () {
    // Open the drawer on start if this is not mobile
    this.doShowNavDrawer = !this.$vuetify.breakpoint.mobile
  },

  methods: {
    ...mapMutations({ setNavDrawer: 'TOGGLE_NAV_DRAWER' }),
    isTacticInMatrix (tacticsObjects, matrixID, i) {
      if (this.selectedObject) {
        // If tatic ID is in URL return true for appropriate field
        const tacticsArrayLength = tacticsObjects.length
        for (let i = 0; i < tacticsArrayLength; i++) {
          if (tacticsObjects[i].id === this.selectedObject.id) {
            // If selected tactic is found within matrix's tactic list
            return true
          }
        }
      } else if (i === 0) {
        // If no tactic ID is found within current URL, return true for only the first matrix (on refresh/if no tactic selected)
        return true
      }
      return false // Otherwise return false
    },
    closeTemporaryDrawer () {
      // Only close the nav drawer if in temporary mode
      if (this.isDrawerTemporary) {
        this.doShowNavDrawer = false
      }
    },
    isTechniqueInMatrix (tacticsObjects, i) {
      if (this.selectedObject) {
        // If tatic ID is in URL return true for appropriate field
        for (let i = 0; i < tacticsObjects.length; i++) {
          for (let j = 0; j < tacticsObjects[i].techniques.length; j++) {
            if (tacticsObjects[i].techniques[j].id === this.selectedObject.id) {
              return true
            }
            if (tacticsObjects[i].techniques[j].subtechniques) {
              for (
                let k = 0;
                k < tacticsObjects[i].techniques[j].subtechniques.length;
                k++
              ) {
                if (
                  tacticsObjects[i].techniques[j].subtechniques[k].id ===
                  this.selectedObject.id
                ) {
                  return true
                }
              }
            }
          }
        }
      } else if (i === 0) {
        // If no tactic ID is found within current URL, return true for only the first matrix (on refresh/if no tactic selected)
        return true
      }
      return false // Otherwise return false
    },
    isTacticInTechnique (tacticID) {
      if (!this.tacticsList) {
        // Tactics list will populate based on tactics list of selected technique
        if (!this.selectedObject) {
          // Returns false if no technique ID is found within current URL
          return false
        }
        if ('subtechnique-of' in this.selectedObject) {
          // Handles case of sub-technique being selected
          const parentTechnique = this.$store.getters['subtechnique/getParent'](
            this.selectedObject
          )
          this.tacticsList = parentTechnique.tactics
        } else {
          // Otherwise use selected tactic
          this.tacticsList = this.selectedObject.tactics
        }
      }
      return this.tacticsList.includes(tacticID) // Let list item know whether or not to select itself
    }
  }
}
</script>
