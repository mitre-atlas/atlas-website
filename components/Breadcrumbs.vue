<template>
  <div class="breadcrumbs">
    <v-breadcrumbs :items="items" class="pl-0">
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  props: ['setPath'],
  data () {
    return {
      items: []
    }
  },
  computed: {
    ...mapGetters(['isSubTechnique'])
  },
  mounted () {
    const pathItems = this.$route.path.split('/').slice(1).filter(e => !!e)// '/this/is/path' -> ['this', 'is', 'path']
    const homeName = 'Home'
    const homeItem = { to: '/', text: homeName }
    const idStemItems = ['tactics', 'techniques', 'studies']

    // ('TA0434', 'tactics') -> true; ('AML.CS98434', 'studies') -> true; ('create-study', 'studies') -> false
    const isIDItem = (location, lastLocation) => idStemItems.includes(lastLocation) && (location.search(/\d/g) > -1)
    let lastLocation = null
    this.items.push(homeItem)

    let pathStem = ''
    for (const location of pathItems) { // ['this', 'is', 'path'] -> [{to: '/this', text: 'This'}, {to: '/this/is', text: 'Is'}, {to: '/this/is/path', text: 'Path'}]
      const locationPath = '/' + location
      const to = pathStem + locationPath
      let text = this.formatLocation(location)

      if (isIDItem(location, lastLocation)) { // 'AML.CS03245' -> 'Failure of Domain Bypass'
        const name = this.getNameFromID(location, lastLocation)
        const id = text
        if ((id.split('.').length - 1) > 1) { // 'Home > Techniques > SubTechnique' -> 'Home > Techniques > ParentTechnique > SubTechnique'
          const parentID = id.slice(0, id.lastIndexOf('.'))
          const parentName = this.getNameFromID(parentID, lastLocation)
          const parentPath = '/' + parentID
          const parentTo = pathStem + parentPath
          const parentItem = { to: parentTo, text: parentName, exact: true }
          this.items.push(parentItem)
          pathStem += parentPath
        }
        text = name
      }

      const item = { to, text, exact: true }
      this.items.push(item)
      pathStem += locationPath
      lastLocation = location
    }

    const lastItem = this.items[this.items.length - 1]
    lastItem.disabled = true
  },
  methods: {
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
