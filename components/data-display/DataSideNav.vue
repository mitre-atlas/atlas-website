<template>
  <v-navigation-drawer
    clipped
    app
    style="z-index: 0;"
  >
    <v-list-item class="mt-10">
      <v-list-item-content>
        <v-list-item-title class="title text-capitalize">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list
      v-if="title === 'techniques'"
      dense
      nav
    >
      <v-list-group
        v-for="(tactic, i) in getMatrix.tactics"
        :key="i"
        no-action
      >
        <template #activator>
          <v-list-item>
            <NuxtLink
              :to="tactic.route"
              style="font-size: 0.9375rem;"
            >
              <!-- Smaller font size, similar to v-expansion-panel-header -->
              {{ tactic.name }} {{selectedTech.description}}
            </NuxtLink>
          </v-list-item>
        </template>

        <div
          v-for="(technique, j) in tactic.techniques"
          :key="j"
        >
          <v-list-item
            :nuxt="true"
            :to="technique.route"
            :ripple="false"
          >
            <v-list-item>
              <v-list-item>
                <v-list-item-title style="font-weight: 400;">
                  <!-- Font size and color to match v-expansion-panel-header style -->
                  {{ technique.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list-item>
          </v-list-item>

          <v-list-item
            v-for="(subtechnique, k) in technique.subtechniques"
            :key="k"
            :nuxt="true"
            :to="subtechnique.route"
            :ripple="false"
          >
            <v-list-item>
              <v-list-item>
                <v-list-item-title class="pl-3" style="font-weight: 400;">
                  {{ subtechnique.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list-item>
          </v-list-item>
        </div>
      </v-list-group>
    </v-list>

    <v-list v-else dense nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :nuxt="true"
        :to="item.route"
        :ripple="false"
      >
        <v-list-item>
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
import { mapGetters } from 'vuex'
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

export default {
  name: 'DataSideNav',
  props: ['items', 'fixedTitle', 'selectedTech'],
  data () {
    return {
      placeholderTitle: 'Placeholder Title',
      footer: null,
      observer: null,
      selectedID: 'AML.T0000.000',
      selectedTech2: this.selectedTech,
      // selectedTech: { id: selectedTech.id, tactic: selectedTech.tactics[0] },
      model: 1
    }
  },

  computed: {
    title () {
      if (this.items && this.items.length > 0) {
        // Plural object type with spaces instead of dashes, if any
        return dataObjectToPluralTitle(this.items[0])
      }
      // Otherwise use the specified title, or the default placeholder
      return this.fixedTitle ?? this.placeholderTitle
    },
    ...mapGetters('matrix', ['getMatrix'])
  },

  mounted () {
    this.attachObserver() // Try attaching as soon as page loads
    document.onreadystatechange = () => { this.attachObserver() } // Or if page has just finished loading
  },

  methods: {
    // Looks for intersection changes to set the height of data-side-nav accordingly
    attachObserver () {
      if (document.readyState === 'complete') { // Wait for page to load
        // Detect visibility changes as per granularity
        const thresholdGranularity = 0.01
        const options = { threshold: [] }
        for (let i = 0; i < 1; i += thresholdGranularity) { options.threshold.push(i) }
        // Grab footer, create observer to watch for visibility changes
        this.footer = document.querySelector('#footer')
        this.observer = new IntersectionObserver(this.clampSideNavHeight, options)
        // Connect observer
        this.observer.observe(this.footer)
      }
    },

    // Prevents data-side-nav from hiding behind footer
    clampSideNavHeight (entries, observer) {
      // Footer observation entry
      const entry = entries[0]
      if (entry.isIntersecting) { // Footer is in view
        // Shorten data-side-nav so that options don't hide behind footer
        this.$el.style.height = `calc(100vh - ${this.$el.offsetTop + entry.intersectionRect.height}px)`
      } else { // Footer is not in view
        // Make data-side-nav full height
        this.$el.style.height = '100vh'
      }
    }
  }

}
</script>
