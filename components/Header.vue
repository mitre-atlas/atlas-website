<template>
  <v-app-bar
    app
    dark
    clipped-left
    color="grey darken-3"
    >

    <v-toolbar-title>
      <nuxt-link to="/">{{ title }}</nuxt-link>
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items
      v-for="(link, i) in links"
      :key="i"
      >

      <v-menu
        v-if="link.isDropdown"
        offset-y
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
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
              v-text="childLink.name"
              :href="childLink.href"
              text
              class="text-capitalize"
              nuxt
            />
          </v-list-item>

        </v-list>
      </v-menu>

      <v-btn
        v-else
        v-text="link.name"
        :href="link.href"
        text
        class="text-capitalize"
        nuxt
      ></v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    title: 'MITRE | AdvML',
    links: [
      {
        name: 'Matrix',
        href: '/matrix'
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
        href: '/studies'
      },
      {
        name: 'Resources',
        isDropdown: true,
        links: [
          {
            name: 'Adversarial ML 101',
            href: '/page/adversarial-ml-101'
          },
          {
            name: 'Contribute',
            href: '/page/contributors'
          },
          {
            name: 'Feedback',
            href: '/page/feedback'
          }
        ]
      }
    ]
  })
}
</script>

<style scoped>
.nuxt-link-active {
  text-decoration: none;
  color: inherit;
}
</style>
