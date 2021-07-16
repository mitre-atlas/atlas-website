<template>
  <!-- <v-btn>WORK</v-btn> v-show="enablePreview || keepPreviewEnabled" -->
  <v-fade-transition>
    <v-card
    id="hcard"
    ref="hcard"
    nuxt
    :to="targetLocation"
    :width="cardWidth"
    elevation="24"
    v-if="enablePreview || keepPreviewEnabled"
    @mouseenter="setPreview"
    @mouseleave="setPreview"
    :style="cardCSS">
      <v-card-title>{{ targetInfo.name }}</v-card-title>
      <v-card-subtitle>{{ targetInfo['object-type'] }}</v-card-subtitle>
      <v-card-text>{{ targetInfo.description }}</v-card-text>
      <!-- <v-card-subtitle>{{ parentEvent }}</v-card-subtitle> -->
    </v-card>
  </v-fade-transition>
</template>

<script>
export default {
  name: 'HoverPreview',
  // props: ['x-off', 'y-off', 'delay', 'targetID', 'parentEvent'],
  props: {
    t: String,
    'x-off': { default: 0, type: Number }, // -50 so wont overlap text
    'y-off': { default: 64 - 30, type: Number }, // the 64 is the height of the topbar, -30 is so it wont overlap the text
    'target-id': { default: '', type: String },
    'parent-event': { default: null },
    delay: { default: 500, type: Number }
  },
  data: () => ({
    info: null,
    isHoveringSelf: false,
    cardWidth: 400,
    // elHeight: 0,
    // renV: false,
    // noE: null,
    enablePreview: false,
    keepPreviewEnabled: false,
    // hoverPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
    isHovering: false,
    // hoverDelay: 500,
    lastElementHTML: null, // change to diff by targetID
    // top: -1,

    cardCSS: { left: 0, top: 0 }
  }),
  watch: {
    // watch x/y values for slide transition
    parentEvent (mouseEvent) {
      this.setPreviewParent(mouseEvent)
      // console.log(newVal)
      // console.log(this.$store.getters.getTechniqueById('AML.T0010.000'))
      // this.info = this.$store.getters.getTechniqueById(ID)
    }
  },
  // mounted () {
  //   this.$nextTick(() => {
  //     // this.noE = this.$el
  //     // this.elHeight = this.$el.clientHeight
  //     // console.log(this.$refs.hcard.clientHeight)
  //     // const h = this.$el.clientHeight || 0
  //     // console.log('fru: ', h, this.elHeight, this.$el)
  //     // this.setPreviewParent(this.parentEvent)
  //   })
  // },
  // updated () {
  //   const hcard = this.$refs.hcard
  //   console.log('hcard updated;', hcard)

  //   if (hcard) {
  //     const ht = hcard.$el.clientHeight // <<<---- get ht
  //     const currentHt = parseInt(this.top.replace(/\D/g, ''))
  //     const newHt = currentHt - ht
  //     console.log('ht', ht, this.top, newHt)

  //     // hcard.$el.style.top = 0 // <<<---- change top
  //     this.cardCSS.top = 100

  //     // hcard.styles['transform']
  //     // this.cardCSS
  //   }
  // },
  computed: {
    // test () {
    //   // this.setPreviewParent(this.parentEvent)
    //   return (this.parentEvent && this.parentEvent.type) || 'none'
    // },
    targetLocation () {
      return `/${this.targetInfo['object-type']}s/${this.targetId}`
    },
    targetInfo () {
      return this.$store.getters.getTechniqueById(this.targetId)
    }
  },
  methods: {
  //   ren () {
  //     setTimeout((that) => {
  //       that.renV = true
  //     }, 0, this)
  //   },

    setPreview (event) {
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const eventName = event.type
      const enablePreview = !disablePreviewEvents.includes(eventName)
      if (enablePreview) {
        this.isHoveringSelf = true
        // console.log('Emitting keep: TRUE', `delay at ${this.delay}`)
        // this.$emit('keep-preview', true)
        this.keepPreviewEnabled = true
      } else {
        this.isHoveringSelf = false
        setTimeout((that) => {
          if (!this.isHoveringSelf) {
            // console.log('Emitting keep: FALSE')
            // that.$emit('keep-preview', false)
            that.keepPreviewEnabled = false
          }
        }, this.delay, this)
      }
    },

    // addOffset () {
    //   const h = this.$el.clientHeight
    //   if (h) {
    //     this.cardCSS.top = this.cardCSS.top - h
    //   }
    // },

    setPreviewParent (event) {
      const eventName = event.type
      const element = event.target
      const elementPos = element.getBoundingClientRect()
      const elementHTML = element.innerHTML
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const enablePreview = !disablePreviewEvents.includes(eventName)
      if (eventName === 'mousemove') { this.mousePosition = { x: event.pageX, y: event.pageY }; return }
      this.isHovering = enablePreview
      this.lastElementHTML = elementHTML
      // console.log(`${eventName} set hover status to ${this.isHovering}, lastHTML: ${elementHTML}`)
      // const h = 0
      // console.log('fru: ', h, this.elHeight, this.noE, document.querySelector('#hcard'))
      setTimeout(function (that) {
        // console.log(`${eventName} wants to set ${enablePreview}, hover status at ${that.isHovering}`)
        // console.log(this.lastElementHTML === elementHTML, enablePreview !== that.isHovering, 'CONDS')
        if ((that.lastElementHTML === elementHTML) && enablePreview !== that.isHovering) { return }
        if (enablePreview) {
          that.enablePreview = true
          // console.log('p:', that.mousePosition.x)
          const x = that.mousePosition.x // + window.scrollX
          const y = elementPos.top + window.scrollY
          // const gmm = that.enablePreview
          // if (gmm) { return }
          // that.hoverPosition = { x, y }
          // that.x = x
          // that.y = y

          let left = `${x - that.xOff}px` // (that['x-offset'] ?? that.defaultXOff) + 'px'
          const top = `${y - that.yOff}px` // (that['y-offset'] ?? that.defaultYOff) + 'px'

          const isOffscreen = x - that.xOff + that.cardWidth > window.innerWidth
          // console.log(x - that.xOff, that.cardWidth, window.innerWidth)

          if (isOffscreen) {
            // console.log('offscreen detected!')
            left = `${x - that.xOff - that.cardWidth}px`
          }

          // console.log(left, top)
          // that.top = top
          // const up = h // that.elHeight
          // const ele = document.querySelector('#hcard')
          // const elee = that.noE
          // console.log('e: ', ele, elee.clientHeight)
          // console.log(`l: ${left}, t: ${top}, up: ${up}`)

          that.cardCSS = { left, top }
          // that.$forceUpdate()
        } else {
          that.enablePreview = false
        }
      }, this.delay, this)
    }
  }
}
</script>

<style scoped>
  .v-card {
    position: absolute;
  }
</style>
