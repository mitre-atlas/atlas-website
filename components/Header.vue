<template>
  <v-app-bar
    app
    dark
    clipped-left
    color="grey darken-3"
    >

    <!-- <v-app-bar-nav-icon class="hidden-lg-and-up" /> -->

    <v-toolbar-title>
      <nuxt-link to="/">
        <img src="~/assets/MITRE-brand_ATLAS_white.png" height="25" />
      </nuxt-link>
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items
      v-for="(link, i) in links"
      :key="i"
      class="hidden-sm-and-down"
      >

      <v-menu
        v-if="link.isDropdown"
        offset-y
        bottom
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

        <v-list>
          <v-list-item
            v-for="(childLink, j) in link.links"
            :key="j"
          >
            <v-btn
              exact
              v-text="childLink.name"
              :to="childLink.href"
              text
              class="text-capitalize"
              nuxt
              exact
            />
          </v-list-item>

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
       <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <div
            v-for="(link, i) in links"
            :key="i"
            >
            <div v-if="link.isDropdown">
              <v-list-item v-for="(childLink, j) in link.links" :key="j">
                <v-btn
                  v-text="childLink.name"
                  :to="childLink.href"
                  text
                  class="text-capitalize"
                  nuxt
                  exact
                />
              </v-list-item>
            </div>
            <v-list-item v-else>
              <v-btn
                v-text="link.name"
                :to="link.href"
                text
                class="text-capitalize"
                nuxt
                exact
              />
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

<style scoped>
