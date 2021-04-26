<template>
  <v-navigation-drawer
    app
    clipped
    >
    <v-list-item class="mt-10">
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list dense nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :nuxt="true"
        :to="`/${basePath}/${item.id}`"
        >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>
              {{ item.name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
  <!-- <div class="side-menu mt-8" style="height: 100%;">
      <v-navigation-drawer permanent left>
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

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

          <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>{{ study.name }}</v-list-item-subtitle>
          </v-list-item-content>
          </v-list-item>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>
  </div> -->
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    title () {
      if (this.$route.name.startsWith('tactics')) {
        return 'Tactics'
      } else if (this.$route.name.startsWith('techniques')) {
        return 'Techniques'
      } else {
        return 'Case Studies'
      }
    },
    items () {
      if (this.$route.name.startsWith('tactics')) {
        return this.$store.getters.getTactics
      } else if (this.$route.name.startsWith('techniques')) {
        return this.$store.getters.getTechniques
      } else {
        return this.$store.getters.getStudies
      }
    },
    basePath () {
      // i.e. tactics, techniques, studies
      return this.$route.path.split('/')[1]
    }
  },
  watch: {
    // TODO Only refresh when needed
    // '$route.name' (to, from) {
    //   console.log(to, from)
    //   if (this.$route.name.startsWith('tactics')) {
    //     this.title = 'Tactics'
    //     this.items = this.$store.getters.getTactics
    //   } else if (this.$route.name.startsWith('techniques')) {
    //     this.title = 'Techniques'
    //     this.items = this.$store.getters.getTechniques
    //   } else {
    //     this.title = 'Case Studies'
    //     this.items = this.$store.getters.getStudies
    //   }
    // }
  }
}
</script>

<style scoped>
.v-list-item__subtitle {
  white-space: normal;
}
</style>
