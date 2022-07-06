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
          // determine label for breadcrumb
          let text = ''
          if (this.$route.name.includes('matrices-id') && index === items.length - 1) {
            const dataObj = this.$store.getters.getMatrixByID(item)
            text = dataObj.name
          } else if (this.$route.name.includes('-id') && index === items.length - 1) { // check if is data object
            const dataObj = this.$store.getters.getDataObjectById(item)
            text = dataObj.name

            // check if it's a subtechnique -- if so, insert parent technique before continuing
            const parent = this.$store.getters['subtechnique/getParent'](dataObj)
            if (parent) {
              this.pathItems.push({
                text: parent.name,
                to: basePath + parent.id + '/',
                exact: true
              })
            }
          } else {
            text = this.formatLocation(item)
          }

          // update basePath to current path
          basePath = basePath + item + '/'

          // add new path
          this.pathItems.push({
            text,
            to: basePath,
            exact: true
          })
        })
      } else {
        this.notHomePage = false
      }
    },
    formatLocation (str) { // hello-there-world -> Hello There World
      const reg = /-(\w)/g
      str = str.charAt(0).toUpperCase() + str.slice(1)
      for (const match of str.matchAll(reg)) {
        str = str.replace(match[0], ' ' + match[1].toUpperCase())
      }
      return str
    }
  }
}

</script>
