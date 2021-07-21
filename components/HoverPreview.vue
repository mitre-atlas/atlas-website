<template>
  <v-fade-transition>
    <v-card
    style="z-index: 3000;"
    id="hcard"
    ref="hcard"
    v-if="(enablePreview || keepPreviewEnabled)"
    nuxt
    target=""
    :to="targetLocation"
    :width="cardWidth"
    elevation="24"
    @mouseenter="setPreview"
    @mouseleave="setPreview"
    :style="cardCSS">
      <v-card-title>{{ targetInfo.name }}</v-card-title>
      <v-card-subtitle>{{ targetInfo['object-type']}}</v-card-subtitle>
      <v-card-text v-if="targetInfo.description.length < characterLimit ">{{ formatDesc(targetInfo.description) }}</v-card-text>
      <v-card-text v-else id="text-fade">{{ formatDesc(targetInfo.description) }}</v-card-text>
      <v-card-actions><v-icon>mdi-arrow-right</v-icon></v-card-actions>
    </v-card>
  </v-fade-transition>
</template>

<script>
export default {
  name: 'HoverPreview',
  // props: ['x-off', 'y-off', 'delay', 'targetID', 'parentEvent'],
  props: {
    'x-off': { default: 0, type: Number },
    'y-off': { default: 64 - 50, type: Number }, // the 64 is the height of the topbar, -30 is so it wont overlap the text
    'parent-event': { default: null },
    appearRight: { default: false },
    fromRight: { default: false },
    appearBottom: { default: false },
    fromBottom: { default: false },
    currentTargetId: { default: '', type: String },
    delay: { default: 500, type: Number }
  },
  data: () => ({
    targetId: null,
    isHoveringSelf: false,
    cardWidth: 400,
    enablePreview: false,
    keepPreviewEnabled: false,
    mousePosition: { x: 0, y: 0 },
    isHovering: false,
    lastTargetId: null,
    self: null,
    characterLimit: 350,

    cardCSS: { left: 0, top: 0 }
  }),
  watch: {
    // watch x/y values for slide transition
    parentEvent (mouseEvent) {
      this.setPreviewParent(mouseEvent)
    }
  },

  updated () { // puts preview in a really high parent so i can position absolutely relative to page
    const hcard = this.$refs.hcard
    if (hcard) {
      this.self = hcard
      const grandcestor = document.querySelector('.container').firstChild
      // console.log(vMainWrap, 'vmw')
      grandcestor.appendChild(this.$refs.hcard.$el)
    }
  },
  computed: {
    targetLocation () {
      return `/${this.targetInfo['object-type']}s/${this.targetId}`
    },
    targetInfo () {
      return (
        this.$store.getters.getTacticById(this.targetId) ||
        this.$store.getters.getTechniqueById(this.targetId))
    }
  },
  methods: {
    formatDesc (text) {
      const tagRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
      text = text.replace(tagRegex, '')
      if (text.length > this.characterLimit) {
        text = text.slice(0, this.characterLimit) + '...'
      }
      return text
    },
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
    setPreviewParent (event) {
      const eventName = event.type
      const element = event.target
      const elementPos = element.getBoundingClientRect()
      // const this.targetId = this.targetId // element.innerHTML
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const enablePreview = !disablePreviewEvents.includes(eventName)
      if (eventName === 'mousemove') { this.mousePosition = { x: event.pageX, y: event.pageY }; return }
      if (eventName === 'click') { this.enablePreview = false; return }
      this.isHovering = enablePreview
      this.lastTargetId = this.targetId
      // console.log(`${eventName} set hover status to ${this.isHovering}, lastHTML: ${this.targetId}`)
      // console.log(document.querySelector('#hcard'))
      // console.log('fru: ', h, this.elHeight, this.noE, document.querySelector('#hcard'))
      setTimeout(function (that) {
        // console.log('finished waiting,', eventName, element, elementPos, this.targetId, disablePreviewEvents, enablePreview, that.lastTargetId)
        // console.log(`${eventName} wants to set ${enablePreview}, hover status at ${that.isHovering}`)
        // console.log(this.lastTargetId === this.targetId, enablePreview !== that.isHovering, 'CONDS')
        // console.log((that.lastTargetId === this.targetId, enablePreview !== that.isHovering)
        if ((that.lastTargetId === that.targetId) && enablePreview !== that.isHovering) { return }
        if ((that.lastTargetId !== that.targetId) && enablePreview === false) { return }

        if (enablePreview) {
          that.enablePreview = true
          that.targetId = that.currentTargetId
          // console.log('p:', that.mousePosition.x)
          setTimeout(function () { // spawn a new thread so we can render AND get rendering info at the same time >:)
            if (!that.self) { return }
            // console.log(`To right? ${that.appearRight}; To bottom? ${that.appearBottom}`)
            // console.log(`From right? ${that.fromRight}; From bottom? ${that.fromBottom}`)
            const [x, y] = [
              (that.xOff === 0) ? that.mousePosition.x : (that.appearRight ? elementPos.right : elementPos.left) + that.xOff,
              (that.appearBottom ? elementPos.bottom : elementPos.top) + window.scrollY - that.yOff
            ]
            let [left, top] = [`${x}px`, `${y}px`]
            const selfElement = that.self.$el // document.querySelector('#hcard')
            const selfHeight = selfElement.getBoundingClientRect().height
            // const selfWidth = selfElement.getBoundingClientRect().width
            // console.log(selfHeight)
            // console.log(y, y + selfHeight, window.innerHeight)
            const offscreenMargin = 75
            const isOffscreenLeft = x + that.cardWidth > window.innerWidth - offscreenMargin
            const isOffscreenTop = y + selfHeight - window.scrollY > window.innerHeight - offscreenMargin
            // console.log(x - that.xOff, that.cardWidth, window.innerWidth)
            // console.log(`left: ${x + that.cardWidth} (o: ?>) bounds: ${window.innerWidth - offscreenMargin}`)
            // console.log(`top: ${y + selfHeight - window.scrollY} (o: ?>) bounds: ${window.innerHeight - offscreenMargin}`)
            // console.log(ele.getBoundingClientRect().height)
            if (isOffscreenLeft) {
              console.log('offscreen detected!')
              left = `${x - that.cardWidth}px`
            }
            // console.log(this.$refs)
            // console.log(that.self.height)
            if (isOffscreenTop) {
              // console.log('offscreen detected!')
              // console.log(y, that.yOff, elementPos.height)
              top = `${y - selfHeight - (5 * that.yOff)}px` // idk why but '5' just works lol
            }
            // console.log('width: ' + that.cardWidth)
            if (that.fromRight) {
              // console.log(left, that.cardWidth, left - that.cardWidth)
              left = `${x - that.cardWidth}px`
              // console.log(left, x, that.cardWidth)
            }
            that.cardCSS = { left, top }
          }, 0)
        } else {
          // console.log('killed preview')
          that.enablePreview = false
          this.lastTargetId = null
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

  .v-card__text, .v-card__title {
    word-break: normal;
  }

  .v-card-actions {
    position: relative;
  }

  .v-icon {
    position: absolute;
    right: 30px;
    bottom: 20px
  }

  #text-fade {
    background:
      linear-gradient(to bottom,
        rgba(0, 0, 0, 0.6),
        rgba(0, 0, 0, 0.5),
        rgb(0, 0, 0, 0));
    display: inline-block;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>
