<template>
  <div v-if="notHomePage" class="breadcrumbs">
    <v-breadcrumbs :items="pathItems" class="pl-0">
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>

export default {
  data () {
    return {
      isDataObject: false,
      pathItems: [],
      notHomePage: true
    }
  },
  watch: {
    $route () {
      this.generateBreadcrumbs()
    }
  },
  mounted () {
    this.generateBreadcrumbs()
  },
  methods: {
    generateBreadcrumbs () {
      this.pathItems = []

      if (this.$route.path !== '/') {
        this.notHomePage = true
        const items = this.$route.path.split('/').slice(1).filter(e => !!e)// '/this/is/path' -> ['this', 'is', 'path']
        this.pathItems.push({ to: '/', text: 'Home', exact: true })
        let basePath = '/'

        items.forEach((item, index) => {
          // generate path for this breadcrumb
          let currPath = ''

          // make sure the truncated path is valid. If not, use previous path
          if (this.isRouteValid(basePath + item + '/')) {
            currPath = basePath + item + '/'
          } else {
            currPath = this.pathItems.at(this.pathItems.length - 1).to
          }

          // determine label for breadcrumb
          let text = ''
          if (this.$route.name.includes('-id') && index === items.length - 1) { // check if is data object
            const dataObj = this.$store.getters.getDataObjectById(item)
            text = this.$store.getters.getDataObjectById(item).name

            // check if it's a subtechnique -- if so, insert parent technique before continuing
            if ('subtechnique-of' in dataObj) {
              const parentID = dataObj['subtechnique-of']
              this.pathItems.push({
                text: this.$store.getters.getDataObjectById(parentID).name,
                to: basePath + parentID + '/',
                exact: true
              })
            }
          } else {
            text = this.formatLocation(item)
          }

          // update basePath regardless of whether the truncated path is valid or not
          basePath = basePath + item + '/'

          // add new path
          this.pathItems.push({
            text,
            to: currPath,
            exact: true
          })
        })
      } else {
        this.notHomePage = false
      }
    },
    isRouteValid (path) {
      let isValid = false
      const isObj = this.$route.name.includes('objectTypePlural') && this.$store.getters.getIsValidType(this.$route.params.objectTypePlural)

      // check each possible route until valid one is found
      this.$router.getRoutes().forEach((route) => {
        if (route.regex.test(path)) {
          // make sure that if the matching route is for an object, the path is also for an object
          if ((route.path.includes('objectTypePlural') && isObj) || !route.path.includes('objectTypePlural')) {
            isValid = true
          }
        }
      })
      return isValid
    },
    formatLocation (str) { // hello-there-world -> Hello There World
      const reg = /-(\w)/g
      str = str.charAt(0).toUpperCase() + str.slice(1)
      for (const match of str.matchAll(reg)) {
        str = str.replace(match[0], ' ' + match[1].toUpperCase())
      }
      return str
    },
    getNameFromID (id, idStem) {
      return this.$store.getters.getDataObjectById(id).name
    }
  }
}

</script>
