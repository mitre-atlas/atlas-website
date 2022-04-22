<template>
  <v-app-bar
    app
    dark
    clipped-left
    elevate-on-scroll
    color="grey darken-3"
    style="z-index:2000;"
  >
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
export default {
  data: ({ $config: { name } }) => ({
    title: `MITRE | ${name.short}`,
    links: [
      {
        name: 'Matrix',
        href: '/matrix'
      },
      {
        name: 'Navigator',
        href: '/navigator'
      },
      // {
      //   name: 'Tactics',
      //   href: '/tactics'
      // },
      // {
      //   name: 'Techniques',
      //   href: '/techniques'
      // },
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
    linksModded () {
      // if (!this.$config.navigator_url) {
      //   for (const link of this.links) {
      //     if (link.name === 'Navigator') {
      //       const index = this.links.indexOf(link)
      //       if (index !== -1) {
      //         this.links.splice(index, 1)
      //       }
      //     }
      //   }
      // }

      const dataKeys = Object.keys(this.$store.state.data.objects)
      // Do not generate a route for case studies, which has its own defined templates
      const dynamicDataKeys = dataKeys.filter(k => k !== 'case-studies')
      const dataLinks = dynamicDataKeys.map((objectType) => {
        // const keyTokens = objectType.split('-')

        return {
          name: objectType,
          href: `/${objectType}`
        }
      })

      return this.links.concat(dataLinks)
    }
  }
}
</script>
