<template>
  <v-app-bar
    app
    dark
    clipped-left
    elevate-on-scroll
    color="grey darken-3"
    style="z-index:2000;"
    >

    <!-- <v-app-bar-nav-icon class="hidden-lg-and-up" /> -->

    <v-toolbar-title>
      <nuxt-link to="/">
        <img src="~/assets/MITRE-brand_ATLAS_tm_white.png" height="27" width='200'/>
      </nuxt-link>
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items
      v-for="(link, i) in links"
      :key="i"
      class="hidden-sm-and-down"
      >

      <v-menu
        class="hidden-sm-and-down"
        v-if="link.isDropdown"
        offset-y
        bottom
        rounded="b-lg t-0"
        transition="slide-y-transition"
        content-class="elevation-2"
        style="z-index:-100;"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            exact
            v-bind="attrs"
            v-on="on"
            text
            class="text-capitalize"
            nuxt
          >
            {{ link.name }}
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>

        <v-list class="hidden-sm-and-down">
          <v-list-item-group :value="selection">
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
        v-text="link.name"
        :to="link.href"
        text
        class="text-capitalize"
        nuxt
      ></v-btn>

    </v-toolbar-items>

    <v-toolbar-items class="hidden-md-and-up">
       <v-menu
        bottom
        right
        offset-y
        rounded="b-lg t-0"
        transition="slide-y-transition"
        content-class="elevation-2"
        style="z-index:-100;">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="hidden-md-and-up">
          <div
            v-for="(link, i) in links"
            :key="i"
            >
            <div v-if="link.isDropdown">
              <v-list-item
                v-for="(childLink, j) in link.links"
                :key="j"
                v-text="childLink.name"
                :to="childLink.href"
                text
                exact
                class="px-6 text-button"
                style="text-transform: capitalize !important;"
                nuxt
                >
              </v-list-item>
            </div>
            <v-list-item
              v-else
              v-text="link.name"
              :to="link.href"
              text
              exact
              class="px-6 text-button"
              nuxt
              style="text-transform: capitalize !important;"
              >
            </v-list-item>
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
      {
        name: 'Tactics',
        href: '/tactics'
      },
      {
        name: 'Techniques',
        href: '/techniques'
      },
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
            name: 'Contact Us',
            href: '/resources/feedback'
          }
        ]
      }
    ]
  })
}
</script>
