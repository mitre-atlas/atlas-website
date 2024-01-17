<template>
  <v-app-bar
    app
    dark
    clipped-left
    elevate-on-scroll
    color="navy"
    style="z-index: 100"
  >

  <!-- TODO: Implement doesPageHaveSideNav (see commented out function below) when tactic/technique/etc pages are done -->
  <!-- <v-app-bar-nav-icon color="white" v-if="doesPageHaveSideNav" @click.prevent="toggle()" />  -->

  <h1 class="pa-3">
    <router-link to="/">
      <img
        src="../assets/MITRE-brand_ATLAS_MITRE_tm_white.svg"
        width="200"
        contain
      />
    </router-link>
  </h1>

  <v-spacer />
    <template v-if="mdAndUp">
      <v-toolbar-items
        v-for="(link, i) in linksModded"
        :key="i"
      >
        <v-menu
          v-if="link.isDropdown"
          close-on-click
        >
          <template #activator="{ props }">

            <v-btn
              v-bind="props"
              class="text-capitalize"
              variant="text"
              
          >
            {{ link.name }}
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
          </template>
          <v-list class="hidden-sm-and-down">
            <v-item-group theme="dark">
              <v-list-item
                v-for="(childLink, j) in link.links"
                :key="j"
                :to="childLink.href"
                class="px-6 text-button text-capitalize"
              >
                {{ childLink.name }}
              </v-list-item>
            </v-item-group>
          </v-list>
        </v-menu>

        <v-btn
          v-else
          :to="link.href"
          class="text-capitalize"
          v-text="link.name"
          stacked
        />
      </v-toolbar-items>
    </template>
    <v-toolbar-items v-if="smAndDown">
      <v-menu

      >
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <div v-for="(link, i) in linksModded" :key="i">
            <div v-if="link.isDropdown">
              <v-list-item
                v-for="(childLink, j) in link.links"
                :key="j"
                :to="childLink.href"
                class="px-6 text-button text-capitalize"
                v-text="childLink.name"
              />
            </div>
            <v-list-item
              v-else
              :to="link.href"
              text
              exact
              class="px-6 text-button text-capitalize"
              v-text="link.name"
            />
          </div>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script setup>

  /**
   * Header navigation bar, present on every page.
   * Included in the layout files.
   */

  import { useMain } from "@/stores/main";
  import { dataObjectToPluralTitle } from "@/assets/dataHelpers.js";
  import { useDisplay } from "vuetify";
  import { useRoute } from 'vue-router'
  import { computed } from 'vue' 

  const route = useRoute()
  const mainStore = useMain();
  const { mdAndUp, smAndDown } = useDisplay(); // Used for breakpoints

  /**
   * Matrices link in navbar
   * @returns {Array}
   */
  const linksBeginning = computed(() => {
    return [{
      name: 'Matrices',
      href: `/matrices/${mainStore.getFirstMatrixId}`
    }]
  })

  /**
   * Array of objects of the dropdown menus in the navigation bar
   * @type {Array}
   */
  const linksEnding = [
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
              name: 'FAQ',
              href: '/resources/faq'
            },
            {
              name: 'Updates',
              href: '/resources/updates'
            },
            {
              name: 'Contact Us',
              href: '/resources/contact'
            },
            {
              name: 'Events',
              href: '/resources/events'
            }
          ]
        }
      ]

  /**
   * Add the Header names and links
   * @returns {Object}
   */
  const linksModded = computed(() => {
    // Add the Navigator Header item if specified
    let navLinks = [];
    if (true) { // TODO: Add boolean check for navigator
      navLinks = [
        {
          name: "Navigator",
          href: "/navigator",
        },
      ];
    }

    // Add data object links
    const dataKeys = Object.keys(mainStore.getDataObjectTypes);
    // Do not generate a route for case studies, which has its own defined templates
    const dynamicDataKeys = dataKeys.filter((k) => k !== "case-studies");
    const dataLinks = dynamicDataKeys.map((objectType) => {
      return {
        name: `${dataObjectToPluralTitle(objectType)}`, // Plural version
        href: `/${dataObjectToPluralTitle(objectType, true)}`, // Last word of the above
      };
    });

    // Sandwich data links between beginning and end links
    return linksBeginning.value.concat(navLinks, dataLinks).concat(linksEnding);
  });

  // /**
  //  * Determines if the page has a sidenav
  //  * @returns {Boolean}
  //  */
  // const doesPageHaveSideNav = computed(() => {
  //   if (route.name == undefined)
  //         return false
  //       return route.name === 'matrices-id' || route.name.includes('objectTypePlural') || route.name.includes('studies')
  //     })


</script>
