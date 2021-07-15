<template>
  <v-card
  nuxt
  :to="targetLocation"
  v-if="renV"
  width="400"
  elevation="24"
  @mouseenter="setPreview"
  @mouseleave="setPreview"
  :style="cardCSS">
    <v-card-title>{{ targetInfo.name }}</v-card-title>
    <v-card-subtitle>{{ targetInfo['object-type'] }}</v-card-subtitle>
    <v-card-text>{{ targetInfo.description }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'HoverPreview',
  props: ['x', 'y', 'x-off', 'y-off', 'delay', 'targetID'],
  data: () => ({
    defaultXOff: 0,
    defaultYOff: 64 + 20, // the 64 is the height of the topbar, 20 is so it wont overlap the text
    info: null,
    isHovering: false,
    elHeight: 0,
    renV: false
  }),
  // watch: {
  //   // watch x/y values for slide transition
  //   targetID (ID) {
  //     console.log(this.$store.getters.getTechniqueById('AML.T0010.000'))
  //     this.info = this.$store.getters.getTechniqueById(ID)
  //   }
  // },
  mounted () {
    this.$nextTick(() => {
      this.elHeight = this.$el.clientHeight
      console.log(this.elHeight)
      this.ren()
    })
  },
  computed: {
    targetLocation () {
      return `/${this.targetInfo['object-type']}s/${this.targetID}`
    },
    targetInfo () {
      return this.$store.getters.getTechniqueById(this.targetID)
    },
    cardCSS () {
      console.log('Recieved:', this.x, this.y, this.targetID, this.elHeight)
      const left = this.x - (this['x-offset'] ?? this.defaultXOff) + 'px'
      const top = this.y - (this['y-offset'] ?? this.defaultYOff) - this.elHeight + 'px'
      return { left, top }
    }
  },
  methods: {
    ren () {
      setTimeout((that) => {
        that.renV = true
      }, 0, this)
    },
    setPreview (event) {
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const eventName = event.type
      const enablePreview = !disablePreviewEvents.includes(eventName)
      if (enablePreview) {
        this.isHovering = true
        console.log('Emitting keep: TRUE', `delay at ${this.delay}`)
        this.$emit('keep-preview', true)
      } else {
        this.isHovering = false
        setTimeout((that) => {
          if (!this.isHovering) {
            console.log('Emitting keep: FALSE')
            that.$emit('keep-preview', false)
          }
        }, this.delay, this)
      }
    }
  }
}
</script>

<style scoped>
  .v-card {
    position: absolute;
  }
</style>
