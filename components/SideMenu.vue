<template>
  <div class="side-menu">
      <v-navigation-drawer absoulte permanent left>
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ title }}
          </v-list-item-title>
          <!-- <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="study in idGetter"
          :key="study.name"
          :link="true"
          :nuxt="true"
          :to="'/' + routeString + '/' + study.id"
        >
          <!-- <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->

          <v-list-item-content>
            <v-list-item-title>{{ study.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      idGetter: '',
      routeString: '',
      title: ''
    }
  },
  methods: {
    setStoreGetter (indexRoute) {
      if (indexRoute === 'techniques') {
        this.idGetter = this.$store.getters.getTechniques
        this.title = 'Techniques'
        this.routeString = 'techniques'
      } else if (indexRoute === 'tactics') {
        this.idGetter = this.$store.getters.getTactics
        this.title = 'Tactics'
        this.routeString = 'tactics'
      } else {
        this.idGetter = this.$store.getters.getStudies
        this.title = 'Case Studies'
        this.routeString = 'studies'
      }
    }
  },
  props: {
    contentType: String
  },
  computed: {
    ...mapGetters(['getStudies', 'getTactics', 'getTechniques'])
  },
  mounted () {
    this.setStoreGetter(this.contentType)
  }
}
</script>

<style>

</style>
