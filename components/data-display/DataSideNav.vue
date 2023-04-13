<template>
  <v-navigation-drawer
    v-model="doShowNavDrawer"
    clipped
    app
    :style="drawerStyle"
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

    <v-list v-if="title === 'techniques'" dense nav style="width: 320px">
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
            <v-list-item
              :nuxt="true"
              :to="technique.route"
              :ripple="false"
              @click="closeTemporaryDrawer"
            >
              <v-list-item-title
                style="font-weight: 400"
                class="text-wrap ml-10"
              >
                <!-- Font size and color to match v-expansion-panel-header style -->
                {{ technique.name }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-for="(subtechnique, l) in technique.subtechniques"
              :key="l"
              :nuxt="true"
              :to="subtechnique.route"
              :ripple="false"
              @click="closeTemporaryDrawer"
            >
              <v-list-item-title
                class="ml-14 text-wrap"
                style="font-weight: 400"
              >
                {{ subtechnique.name }}
              </v-list-item-title>
            </v-list-item>
          </div>
        </v-list-group>
      </v-list-group>
    </v-list>

    <!-- Sidebar for TACTICS --------------------------------------------------->

    <v-list v-else-if="title === 'tactics'" dense nav style="width: 320px">
      <v-list-group
        v-for="(tacticObjects, matrixID, i) in $store.state.data.objects
          .tactics"
        :key="i"
        no-action
        :value="isTacticInMatrix(tacticObjects, i)"
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
          <v-list-item
            :nuxt="true"
            :to="tactic.route"
            :ripple="false"
            @click="closeTemporaryDrawer"
          >
            <v-list-item-content
              class="blue--text text--darken-2 ml-5"
              style="font-size: 0.9375rem"
            >
              {{ tactic.name }}
            </v-list-item-content>
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
        style="width: 320px"
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

/**
 * Collapsable navigation drawer for data object selection on the left-hand side
 * of individual or all data object pages
 */
export default {
  name: 'DataSideNav',
  data () {
    return {
      /**
       * Overflow CSS property
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/overflow}
       */
      overflowScroll: 'hidden'
    }
  },
  computed: {
    // CSS style for the navigation drawer
    drawerStyle () {
      return {
        '--overflow-scroll': this.overflowScroll,
        'z-index': 3000
      }
    },
    /**
     * Data that populates the navigation drawer
     * as queried from the store
     * @todo Consider simplifying in template
     */
    navItems () {
      return this.$store.state.navDrawerItems
    },
    /**
     * Retrieves the navigation drawer title from the store -
     * either a plural version of the contained items' object type,
     * or a specified title
     * @todo Consider making a store getter
     * @type {String}
     */
    title () {
      return this.$store.state.navDrawerTitle
    },
    ...mapGetters(['getDataObjectById']),
    /**
     * Returns an array of this URL's path tokens
     * @type {String[]}
     */
    currentTechniqueRouteID () {
      return this.$route.path
        .split('/')
        .slice(1)
        .filter(e => !!e) // '/this/is/path' -> ['this', 'is', 'path']
    },
    /**
     * Getter and setter for store's doShowNavDrawer
     * @todo LW is there a better way to do this?
     */
    doShowNavDrawer: {
      get () {
        return this.$store.state.doShowNavDrawer
      },
      set (value) {
        this.setNavDrawer(value)
      }
    },
    // Whether to add the `temporary` prop to the navigation drawer for mobile display
    isDrawerTemporary () {
      return this.doShowNavDrawer && this.$vuetify.breakpoint.mobile
    }
  },

  watch: {
    '$vuetify.breakpoint.mobile' (isMobile) {
      if (isMobile && this.doShowNavDrawer) {
        // Close drawer when going to mobile with it open
        this.doShowNavDrawer = false
      }

      if (isMobile) {
        this.overflowScroll = 'auto'
      } else {
        this.overflowScroll = 'hidden'
      }
    }
  },

  mounted () {
    // Open the drawer on start if this is not mobile
    this.doShowNavDrawer = !this.$vuetify.breakpoint.mobile
  },

  methods: {
    ...mapMutations({ setNavDrawer: 'TOGGLE_NAV_DRAWER' }),
    /**
     * Keeps the matrix dropdown list unfolded based on the currently active/selected tactic
     * Used in the tactics section of this sidebar
     * @param {Object[]} tacticsObjects - The tactic data objects in this matrix
     * @param {Number} i - Index of the matrix in the overall matrices list
     * @returns {Boolean}
     */
    isTacticInMatrix (tacticsObjects, i) {
      // QUESTION: should no matrix be dropped down when first navigate to tactics page (ie no tactic selected)?
      const currRoute = this.currentTechniqueRouteID
      if (currRoute.length > 1) {
        // a tactic was selected
        for (let i = 0; i < tacticsObjects.length; i++) {
          // if tactic in route is in matrix, dropdown that matrix
          if (tacticsObjects[i].id === currRoute[1]) {
            return true
          }
        }
      } else if (i === 0) {
        // no tactic selected, automatically dropdown first matrix
        return true
      }
      return false
    },
    /**
     * Called when the matrix ID section headers are clicked in mobile mode,
     * to make the content more visible
     */
    closeTemporaryDrawer () {
      // Only close the nav drawer if in temporary mode
      if (this.isDrawerTemporary) {
        this.doShowNavDrawer = false
      }
    },
    /**
     * Keeps the matrix dropdown list unfolded based on the currently active/selected technique
     * Used in the techniques section of this sidebar
     * @param {Object[]} tacticsObjects - The tactic data objects in this matrix
     * @param {Number} i - Index of the matrix in the overall matrices list
     * @returns {Boolean}
     */
    isTechniqueInMatrix (tacticsObjects, i) {
      const currRoute = this.currentTechniqueRouteID
      if (currRoute.length > 1) {
        // a technique was selected
        for (let i = 0; i < tacticsObjects.length; i++) {
          // if technique/subtechnique in route is in matrix, dropdown that matrix
          for (let j = 0; j < tacticsObjects[i].techniques.length; j++) {
            if (tacticsObjects[i].techniques[j].id === currRoute[1]) {
              return true
            } else if (tacticsObjects[i].techniques[j].subtechniques) {
              for (
                let k = 0;
                k < tacticsObjects[i].techniques[j].subtechniques.length;
                k++
              ) {
                if (
                  tacticsObjects[i].techniques[j].subtechniques[k].id ===
                  currRoute[1]
                ) {
                  return true
                }
              }
            }
          }
        }
      } else if (i === 0) {
        // no tactic selected, automatically dropdown first matrix
        return true
      }
      return false
    },
    /**
     * Keeps the tactic dropdown list unfolded based on the currently active/selected technique
     * @param {String} tacticID
     */
    isTacticInTechnique (tacticID) {
      const currRoute = this.currentTechniqueRouteID
      const tacticObj = this.getDataObjectById(tacticID)
      if (currRoute.length > 1) {
        for (let i = 0; i < tacticObj.techniques.length; i++) {
          if (tacticObj.techniques[i].id === currRoute[1]) {
            return true
          } else if (tacticObj.techniques[i].subtechniques) {
            for (
              let j = 0;
              j < tacticObj.techniques[i].subtechniques.length;
              j++
            ) {
              if (
                tacticObj.techniques[i].subtechniques[j].id === currRoute[1]
              ) {
                return true
              }
            }
          }
        }
      }
      return false
    }
  }
}
</script>
<style scoped>
::v-deep div.v-navigation-drawer__content {
  overflow-y: var(--overflow-scroll);
}
::v-deep div.v-navigation-drawer__content:hover {
  overflow-y: auto !important;
}
</style>
