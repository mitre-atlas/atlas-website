<template>
  <v-app-bar
    app
    dark
    clipped-left
    elevate-on-scroll
    color="grey darken-3"
    style="z-index:100;"
  >
    <v-app-bar-nav-icon v-if="doesPageHaveSideNav" @click.prevent="toggle()" />

    <v-toolbar-title>
      <nuxt-link to="/">
        <img src="~/assets/MITRE-brand_ATLAS_MITRE_tm_white.svg" width="200">
      </nuxt-link>
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items
      v-for="(link, i) in linksModded"
      :key="i"
      class="hidden-sm-and-down"
    >
      <v-menu
        v-if="link.isDropdown"
        class="hidden-sm-and-down"
        offset-y
        bottom
        rounded="b-lg t-0"
        transition="slide-y-transition"
        content-class="elevation-2"
        style="z-index:-100;"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            exact
            v-bind="attrs"
            text
            class="text-capitalize"
            nuxt
            v-on="on"
          >
            {{ link.name }}
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>

        <v-list class="hidden-sm-and-down">
          <v-list-item-group>
            <v-list-item
              v-for="(childLink, j) in link.links"
              :key="j"
              nuxt
              :to="childLink.href"
              exact
              style="text-transform: capitalize !important;"
              class="px-6 text-button"
            >
              {{ childLink.name }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        exact
        :to="link.href"
        text
        class="text-capitalize"
        nuxt
        v-text="link.name"
      />
    </v-toolbar-items>

    <v-toolbar-items class="hidden-md-and-up">
      <v-menu
        bottom
        right
        offset-y
        rounded="b-lg t-0"
        transition="slide-y-transition"
        content-class="elevation-2"
        style="z-index:-100;"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="hidden-md-and-up">
          <div
            v-for="(link, i) in linksModded"
            :key="i"
          >
            <div v-if="link.isDropdown">
              <v-list-item
                v-for="(childLink, j) in link.links"
                :key="j"
                :to="childLink.href"
                text
                exact
                class="px-6 text-button"
                style="text-transform: capitalize !important;"
                nuxt
                v-text="childLink.name"
              />
            </div>
            <v-list-item
              v-else
              :to="link.href"
              text
              exact
              class="px-6 text-button"
              nuxt
              style="text-transform: capitalize !important;"
              v-text="link.name"
            />
          </div>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

export default {
  data: ({ $config: { name } }) => ({
    title: `MITRE | ${name.short}`,
    linksEnding: [
      {
        name: 'Case Studies',
        isDropdown: true,
        links: [
          {
            name: 'Explore Case Studies',
            href: '/studies'
          },
          {
            name: 'Build Case Study',
            href: '/studies/create'
          }
        ]
      },
      {
        name: 'Resources',
        isDropdown: true,
        links: [
          {
            name: 'General information',
            href: '/resources/info'
          },
          {
            name: 'Adversarial ML 101',
            href: '/resources/adversarial-ml-101'
          },
          {
            name: 'Contribute',
            href: '/resources/contribute'
          },
          {
            name: 'Updates',
            href: '/resources/updates'
          },
          {
            name: 'Contact Us',
            href: '/resources/contact'
          }
        ]
      }
    ]
  }),
  computed: {
    ...mapGetters(['getFirstMatrixId']),
    linksBeginning () {
      return [{
        name: 'Matrices',
        href: `/matrices/${this.getFirstMatrixId}`
      }]
    },
    linksModded () {
      // Add the Navigator Header item if specified
      let navLinks = []
      if (this.$config.navigator_url) {
        navLinks = [
          {
            name: 'Navigator',
            href: '/navigator'
          }
        ]
      }

      // Add data object links
      const dataKeys = Object.keys(this.$store.state.data.objects)
      // Do not generate a route for case studies, which has its own defined templates
      const dynamicDataKeys = dataKeys.filter(k => k !== 'case-studies')
      const dataLinks = dynamicDataKeys.map((objectType) => {
        // const keyTokens = objectType.split('-')

        return {
          name: `${dataObjectToPluralTitle(objectType)}`, // Plural version
          href: `/${dataObjectToPluralTitle(objectType, true)}` // Last word of the above
        }
      })

      // Sandwich data links between beginning and end links
      // if (this.linksBeginning) {
      //   return this.linksBeginning.concat(navLinks, dataLinks, this.linksEnding)
      // }
      return this.linksBeginning.concat(navLinks, dataLinks, this.linksEnding)
    },
    doesPageHaveSideNav () {
      // Only matrices, objectTypePlural, and studies routes have side navs
      return this.$route.name === 'matrices-id' || this.$route.name.includes('objectTypePlural') || this.$route.name.includes('studies')
    }
  },
  methods: {
    ...mapMutations({ toggle: 'TOGGLE_NAV_DRAWER' })
  }
}
</script>
