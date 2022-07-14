<template>
  <v-navigation-drawer
    v-model="doShowNavDrawer"
    clipped
    app
    style="z-index: 3000;"
    :width="325"
    :temporary="doShowNavDrawer && $vuetify.breakpoint.mobile"
    v-resize="onResize"
  >
    <v-list-item class="mt-10">
      <v-list-item-content>
        <v-list-item-title class="title text-capitalize">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- Sidebar for TECHNIQUES---------------------------------------------------------------------->

    <v-list
      v-if="title === 'techniques'"
      dense
      nav
    >
      <v-list-group
        v-for="(tacticObjects, matrixID, i) in $store.state.data.objects.tactics"
        :key="i"
        no-action
        :value="(isTechniqueInMatrix(tacticObjects))"
      >
        <template #activator>
          <v-list-item>
            <NuxtLink
              :to="`/matrices/${matrixID}`"
              style="font-size: 0.9375rem;"
              @click.native="setNavDrawer(false)"
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
          :value="(isTacticInTechnique(tactic.id))"
        >
          <template #activator>
            <v-list-item>
              <v-list-item>
                <NuxtLink
                  :to="tactic.route"
                  style="font-size: 0.9375rem;"
                  @click.native="setNavDrawer(false)"
                >
                  <!-- Smaller font size, similar to v-expansion-panel-header -->
                  {{ tactic.name }}
                </NuxtLink>
              </v-list-item>
            </v-list-item>
          </template>

          <div
            v-for="(technique, k) in tactic.techniques"
            :key="k"
          >
            <v-list-item
              :nuxt="true"
              :to="technique.route"
              :ripple="false"
            >
              <v-list-item @click="setNavDrawer(false)">
                <v-list-item-title style="font-weight: 400;" class="text-wrap">
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
                <v-list-item @click="setNavDrawer(false)">
                  <v-list-item-title class="pl-1 text-wrap" style="font-weight: 400;">
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

    <v-list
      v-else-if="title === 'tactics'"
      dense
      nav
    >
      <v-list-group
        v-for="(tacticObjects, matrixID, i) in $store.state.data.objects.tactics"
        :key="i"
        no-action
        :value="(isTacticInMatrix(tacticObjects, matrixID))"
      >
        <template #activator>
          <v-list-item>
            <NuxtLink
              :to="`/matrices/${matrixID}`"
              style="font-size: 0.9375rem;"
              @click.native="setNavDrawer(false)"
            >
              <!-- Smaller font size, similar to v-expansion-panel-header -->
              {{ matrixID }}
            </NuxtLink>
          </v-list-item>
        </template>

        <div
          v-for="(tactic, j) in tacticObjects"
          :key="j"
        >
          <v-list-item
            :nuxt="true"
            :to="tactic.route"
            :ripple="false"
          >
            <v-list-item>
              <v-list-item @click="setNavDrawer(false)">
                <v-list-item-title style="font-weight: 400;">
                  <!-- Font size and color to match v-expansion-panel-header style -->
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
        v-for="(item, i) in items"
        :key="i"
        :nuxt="true"
        :to="item.route"
        :ripple="false"
      >
        <v-list-item @click="setNavDrawer(false)">
          <v-list-item-content class="blue--text text--darken-2" style="font-size: 0.9375rem;">
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
  props: ['items', 'fixedTitle', 'selectedObject'],
  data () {
    return {
      placeholderTitle: 'Placeholder Title',
      footer: null,
      observer: null,
      tacticsList: null
    }
  },

  computed: {
    title () {
      if (this.items && this.items.length > 0 && !this.fixedTitle) {
        // Plural object type with spaces instead of dashes, if any
        return dataObjectToPluralTitle(this.items[0])
      }
      // Otherwise use the specified title, or the default placeholder
      return this.fixedTitle ?? this.placeholderTitle
    },
    ...mapGetters(['getDataObjectById']),
    currentTechniqueRouteID () {
      return this.$route.path.split('/').slice(1).filter(e => !!e)// '/this/is/path' -> ['this', 'is', 'path']
    },
    doShowNavDrawer: {
      get () {
        return this.$store.state.doShowNavDrawer
      },
      set (value) {
        this.setNavDrawer(value)
      }
    },
    headerHeight () {
      return this.$vuetify.application.top
    }
  },

  watch: {
    '$vuetify.breakpoint.mobile' (isMobile) {
      if (isMobile && this.doShowNavDrawer) {
        // Close drawer when going to mobile with it open
        this.setNavDrawer(false)
      }
    }
  },

  mounted () {
    // Open the drawer on start if this is not mobile
    this.setNavDrawer(!this.$vuetify.breakpoint.mobile)
  },

  methods: {
    isTacticInMatrix (tacticsObjects, matrixID) {
      if (!this.selectedObject) { // Returns false if no tactic ID is found within current URL (if no tactic selected)
        return false
      }
      const tacticsArrayLength = tacticsObjects.length
      for (let i = 0; i < tacticsArrayLength; i++) {
        if (tacticsObjects[i].id === this.selectedObject.id) { // If selected tactic is found within matrix's tactic list
          return true
        }
      }
      return false // Otherwise return false
    },
    isTechniqueInMatrix (tacticsObjects) {
      if (!this.selectedObject) { // Returns false if no technique ID is found within current URL (if no technique selected)
        return false
      }
      for (let i = 0; i < tacticsObjects.length; i++) {
        for (let j = 0; j < tacticsObjects[i].techniques.length; j++) {
          if (tacticsObjects[i].techniques[j].id === this.selectedObject.id) {
            return true
          }
          if (tacticsObjects[i].techniques[j].subtechniques) {
            for (let k = 0; k < tacticsObjects[i].techniques[j].subtechniques.length; k++) {
              if (tacticsObjects[i].techniques[j].subtechniques[k].id === this.selectedObject.id) {
                return true
              }
            }
          }
        }
      }
      return false // Otherwise return false
    },
    isTacticInTechnique (tacticID) {
      if (!this.tacticsList) { // Tactics list will populate based on tactics list of selected technique
        if (!this.selectedObject) { // Returns false if no technique ID is found within current URL
          return false
        }
        if ('subtechnique-of' in this.selectedObject) { // Handles case of sub-technique being selected
          const parentTechnique = this.$store.getters['subtechnique/getParent'](this.selectedObject)
          this.tacticsList = parentTechnique.tactics
        } else { // Otherwise use selected tactic
          this.tacticsList = this.selectedObject.tactics
        }
      }
      return this.tacticsList.includes(tacticID) // Let list item know whether or not to select itself
    },

    onResize () {
      // Only if not mobile
      if (!this.$vuetify.breakpoint.mobile) {
        // Calculate the max height for sidebar to fit between header and footer
        const footer = document.querySelector('#footer')
        // Bounding rect gives decimal height in pixels
        const footerHeight = footer.getBoundingClientRect().height
        const headerFooterHeight = this.headerHeight + footerHeight
        // Set max height of the element
        this.$el.style.maxHeight = `calc(100% - ${headerFooterHeight}px)`
      }
    },

    ...mapMutations({ setNavDrawer: 'TOGGLE_NAV_DRAWER' })
  }

}
</script>
