<template>
  <v-app-bar
    app
    dark
    clipped-left
    elevate-on-scroll
    color="navy"
    style="z-index: 100"
  >

  <!-- TODO v-if="doesPageHaveSideNav" -->
  <!-- <v-app-bar-nav-icon color="white" v-if="doesPageHaveSideNav" @click.prevent="toggle()" />  -->
  <h1 class="pa-3">
    <a href="/">
      <img
        src="../assets/MITRE-brand_ATLAS_MITRE_tm_white.svg"
        width="200"
        contain
      />
    </a>
  </h1>

  <v-spacer />

    <v-app-bar-items
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
        style="z-index: -100"
      >
        <template #activator="{ props }">
          <v-btn
            exact
            v-bind="attrs"
            text
            class="text-capitalize white--text"
            nuxt
          >
            {{ link.name }}
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>

        <v-list class="hidden-sm-and-down">
          <v-item-group>
            <v-item
              v-for="(childLink, j) in link.links"
              :key="j"
              nuxt
              :to="childLink.href"
              exact
              style="text-transform: capitalize !important"
              class="px-6 text-button"
            >
              {{ childLink.name }}
            </v-item>
          </v-item-group>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        exact
        :to="link.href"
        text
        class="text-capitalize white--text"
        nuxt
        v-text="link.name"
      />
    </v-app-bar-items>

    <v-app-bar-items class="hidden-md-and-up">
      <v-menu
        bottom
        right
        offset-y
        rounded="b-lg t-0"
        transition="slide-y-transition"
        content-class="elevation-2"
        style="z-index: 4000"
      >
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="hidden-md-and-up">
          <div v-for="(link, i) in linksModded" :key="i">
            <div v-if="link.isDropdown">
              <v-item
                v-for="(childLink, j) in link.links"
                :key="j"
                :to="childLink.href"
                text
                exact
                class="px-6 text-button"
                style="text-transform: capitalize !important"
                nuxt
                v-text="childLink.name"
              />
            </div>
            <v-item
              v-else
              :to="link.href"
              text
              exact
              class="px-6 text-button"
              nuxt
              style="text-transform: capitalize !important"
              v-text="link.name"
            />
          </div>
        </v-list>
      </v-menu>
    </v-app-bar-items>
  </v-app-bar>
</template>
<script setup>
import { computed} from 'vue'
const linksModded = computed(() => {
  return [
  {
    "name": "Matrices",
    "href": "/matrices/ATLAS"
  },
  {
    "name": "tactics",
    "href": "/tactics"
  },
  {
    "name": "techniques",
    "href": "/techniques"
  },
  {
    "name": "mitigations",
    "href": "/mitigations"
  },
  {
    "name": "Case Studies",
    "isDropdown": true,
    "links": [
      {
        "name": "Explore Case Studies",
        "href": "/studies"
      },
      {
        "name": "Build Case Study",
        "href": "/studies/create"
      }
    ]
  },
  {
    "name": "Resources",
    "isDropdown": true,
    "links": [
      {
        "name": "General information",
        "href": "/resources/info"
      },
      {
        "name": "Adversarial ML 101",
        "href": "/resources/adversarial-ml-101"
      },
      {
        "name": "Contribute",
        "href": "/resources/contribute"
      },
      {
        "name": "FAQ",
        "href": "/resources/faq"
      },
      {
        "name": "Updates",
        "href": "/resources/updates"
      },
      {
        "name": "Contact Us",
        "href": "/resources/contact"
      }
    ]
  }
]
});
</script>