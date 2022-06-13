<template>
  <div class="breadcrumbs">
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
      pathItems: []
    }
  },
  mounted () {
    this.generateBreadcrumbs()
  },
  methods: {
    generateBreadcrumbs () {
      this.pathItems = []
      const items = this.$route.path.split('/').slice(1).filter(e => !!e)// '/this/is/path' -> ['this', 'is', 'path']
      console.log('PATH ITEMS: ', items)
      console.log('ROUTE OBJECT: ')
      console.log(this.$route)
      this.pathItems.push({ to: '/', text: 'Home', exact: true })
      items.forEach((item, index) => {
        // generate path for this breadcrumb
        const basePath = this.pathItems.at(this.pathItems.length - 1).to
        console.log('BASE PATH: ', basePath)

        // determine label for breadcrumb
        let text = ''
        if (this.$route.name.includes('-id') && index === items.length - 1) { // check if is data object
          console.log('IS DATA OBJECT; GETTER OUTPUT: ')
          const dataObj = this.$store.getters.getDataObjectById(item)
          console.log(dataObj)
          text = this.$store.getters.getDataObjectById(item).name

          // check if it's a subtechnique -- if so, insert parent technique before continuing
          if ('subtechnique-of' in dataObj) {
            console.log('CRUMB IS DATA OBJECT')
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
        console.log('PUSHING NEXT CRUMB')
        this.pathItems.push({
          text,
          to: basePath + item + '/',
          exact: true
        })
      })
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
  },
  watch: {
    $route () {
      this.generateBreadcrumbs()
    }
  }
}

</script>
