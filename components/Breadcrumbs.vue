<template>
  <div v-if="notHomePage">
    <v-breadcrumbs :items="pathItems">
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
/**
 * Breadcrumbs show the path of where on the website you are.
 */
export default {
  data () {
    return {
      /**
       * Array of objects contains the path to your current page.
       * {
       *    text: title
       *    to: path,
       *    exact: boolean
       * }
       * @type {Array}
       */
      pathItems: [],
      /**
       * Homepage does not display breadcrumbs
       * @type {Boolean}
       */
      notHomePage: true
    }
  },
  watch: {
    /**
     * Watch the user's route to update breadcrumbs as it changes
     */
    $route () {
      this.generateBreadcrumbs()
    }
  },
  mounted () {
    /**
     * Generate breadcrumbs on page load
     */
    this.generateBreadcrumbs()
  },
  methods: {
    /**
     * Build up array of breadcrumbs to display from route.
     */
    generateBreadcrumbs () {
      this.pathItems = []

      if (this.$route.path !== '/') {
        this.notHomePage = true
        const items = this.$route.path
          .split('/')
          .slice(1)
          .filter(e => !!e) // '/this/is/path' -> ['this', 'is', 'path']
        this.pathItems.push({ to: '/', text: 'Home', exact: true })
        let basePath = '/'
        const routeName = this.$route.name

        // check if path has an id or if it's undefined
        const hasID = !!this.$route.params.id

        if (this.$route.name.includes('matrices-id')) {
          // add breadcrumb for matrices that points to the current matrix
          this.addCrumb('Matrices', this.$route.path)

          // get the matrix name to display in breadcrumb
          if (hasID) {
            const dataObj = this.$store.getters.getMatrixByID(
              this.$route.params.id
            )

            if (dataObj) {
              this.addCrumb(dataObj.name, this.$route.path)
            }
          }
        } else {
          items.forEach((item, index) => {
            // determine label for breadcrumb
            let text = ''

            // check if is data object
            if (
              routeName.includes('-id') &&
              index === items.length - 1 &&
              hasID
            ) {
              const dataObj = this.$store.getters.getDataObjectById(item)
              if (dataObj) {
                text = dataObj.name

                // check if it's a subtechnique -- if so, insert parent technique before continuing
                const parent =
                  this.$store.getters['subtechnique/getParent'](dataObj)
                if (parent) {
                  this.pathItems.push({
                    text: parent.name,
                    to: basePath + parent.id + '/',
                    exact: true
                  })
                }
              }
            } else {
              text = this.formatLocation(item)
            }

            // update basePath to current path
            basePath = basePath + item + '/'
            this.addCrumb(text, basePath)
          })
        }
      } else {
        this.notHomePage = false
      }
    },
    /**
     * Add breadcrumbs to array
     * @param {String} text
     * @param {String} path
     */
    addCrumb (text, path) {
      this.pathItems.push({
        text,
        to: path,
        exact: true
      })
    },
    /**
     * Parse url strings to display as a breadcrumb title
     * Example: hello-there-world -> Hello There World
     * @param {String} str
     * @returns {String}
     */
    formatLocation (str) {
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
