<template>
  <!-- <v-btn>WORK</v-btn> v-show="enablePreview || keepPreviewEnabled"  v-if="enablePreview || keepPreviewEnabled" -->
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
      <v-card-subtitle>{{ targetInfo['object-type']}}</v-card-subtitle> <!--  + ', ' + targetInfo.description.length -->
      <v-card-text v-if="targetInfo.description.length < characterLimit ">{{ formatDesc(targetInfo.description) }}</v-card-text>
      <v-card-text v-else id="text-fade">{{ formatDesc(targetInfo.description) }}</v-card-text>
      <v-card-actions><v-icon>mdi-arrow-right</v-icon></v-card-actions>
      <!-- <v-card-text v-else v-html="desc()"></v-card-text> -->
      <!-- <template v-else>
        <v-card-text v-html="desc()"></v-card-text>
        <v-card-text>Click to view more</v-card-text>
      </template> -->

      <!-- <v-card-actions class="pl-0"><v-card-text style="z-index:10000" class="mt-0 mb-0">Click to view more</v-card-text></v-card-actions> -->
      <!-- <v-card-actions>
        <v-btn
        text
        color="teal accent-4">
          See more
        </v-btn>
      </v-card-actions> -->
      <!-- <v-card-subtitle>{{ parentEvent }}</v-card-subtitle> -->
    </v-card>
  </v-fade-transition>
</template>

<script>
export default {
  name: 'HoverPreview',
  // props: ['x-off', 'y-off', 'delay', 'targetID', 'parentEvent'],
  props: {
    'x-off': { default: 0, type: Number }, // -50 so wont overlap text
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
    info: null,
    targetId: null,
    isHoveringSelf: false,
    cardWidth: 400,
    // elHeight: 0,
    // renV: false,
    // noE: null,
    useSlide: false,
    enablePreview: false,
    keepPreviewEnabled: false,
    // hoverPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
    isHovering: false,
    // hoverDelay: 500,
    lastElementHTML: null, // change to diff by targetID
    // top: -1,
    self: null,
    characterLimit: 350,

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

  updated () {
    const hcard = this.$refs.hcard
    if (hcard) {
      this.self = hcard
      const grandcestor = document.querySelector('.container').firstChild
      // console.log(vMainWrap, 'vmw')
      grandcestor.appendChild(this.$refs.hcard.$el)
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
      return (
        this.$store.getters.getTacticById(this.targetId) ||
        this.$store.getters.getTechniqueById(this.targetId))
    }
  },
  methods: {
  //   ren () {
  //     setTimeout((that) => {
  //       that.renV = true
  //     }, 0, this)
  //   },
    formatDesc (text) {
      const tagRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
      text = text.replace(tagRegex, '')
      if (text.length > this.characterLimit) {
        text = text.slice(0, this.characterLimit) + '...'
      }
      return text
    },
    // desc () {
    //   const descText = this.targetInfo.description.slice(0, this.characterLimit) + '...'
    //   const effectStart = Math.floor(descText.length * 0.75)
    //   const effectText = descText.slice(effectStart)
    //   const normalText = descText.slice(0, effectStart)
    //   const chunkCount = Math.min(effectText.length, 100)
    //   const chunkSize = Math.floor(effectText.length / chunkCount)
    //   const defaultAlpha = 0.6

    //   let chunks = ''
    //   for (let chunk = 0; chunk < chunkCount; chunk++) {
    //     // console.log(chunk, chunk++, chunkCount)
    //     const chunkStart = chunk * chunkSize
    //     const chunkEnd = chunkStart + chunkSize // (chunk + 1) * chunkSize
    //     const chunkText = effectText.slice(chunkStart, chunkEnd) // chunkText +=
    //     // console.log(chunkText)
    //     const opacity = (defaultAlpha - ((chunk) / chunkCount) * defaultAlpha) // * defaultAlpha
    //     // console.log(chunkStart, chunkEnd, chunkSize, chunkText, opacity)
    //     // console.log(opacity)
    //     // const spanStart = '<span>'
    //     const spanStart = `<span style="color: rgba(0, 0, 0, ${opacity});">`
    //     const spanEnd = '</span>'
    //     chunks += spanStart + chunkText + spanEnd
    //   }
    //   return normalText + chunks
    // },

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
      const elementHTML = this.targetId // element.innerHTML
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const enablePreview = !disablePreviewEvents.includes(eventName)
      if (eventName === 'mousemove') { this.mousePosition = { x: event.pageX, y: event.pageY }; return }
      if (eventName === 'click') { this.enablePreview = false; return }
      this.isHovering = enablePreview
      this.lastElementHTML = elementHTML
      // console.log(`${eventName} set hover status to ${this.isHovering}, lastHTML: ${elementHTML}`)
      // const h = 0
      // console.log(document.querySelector('#hcard'))
      // console.log('fru: ', h, this.elHeight, this.noE, document.querySelector('#hcard'))
      setTimeout(function (that) {
        // console.log('finished waiting,', eventName, element, elementPos, elementHTML, disablePreviewEvents, enablePreview, that.lastElementHTML)
        // console.log(`${eventName} wants to set ${enablePreview}, hover status at ${that.isHovering}`)
        // console.log(this.lastElementHTML === elementHTML, enablePreview !== that.isHovering, 'CONDS')
        // console.log((that.lastElementHTML === elementHTML, enablePreview !== that.isHovering)
        if ((that.lastElementHTML === elementHTML) && enablePreview !== that.isHovering) { return }
        if ((that.lastElementHTML !== elementHTML) && enablePreview === false) { return }

        if (enablePreview) {
          that.enablePreview = true
          that.targetId = that.currentTargetId
          // console.log('p:', that.mousePosition.x)

          setTimeout(function () { // spawn a new thread so we can render AND get rendering info at the same time >:)
            // const x = that.mousePosition.x // + window.scrollX
            // const y = elementPos.top + window.scrollY
            // const gmm = that.enablePreview
            // if (gmm) { return }
            // that.hoverPosition = { x, y }
            // that.x = x
            // that.y = y
            // let bottom = null

            if (!that.self) { return }
            console.log(`To right? ${that.appearRight}; To bottom? ${that.appearBottom}`)
            console.log(`From right? ${that.fromRight}; From bottom? ${that.fromBottom}`)
            const [x, y] = [
              (that.xOff === 0) ? that.mousePosition.x : (that.appearRight ? elementPos.right : elementPos.left) + that.xOff,
              (that.appearBottom ? elementPos.bottom : elementPos.top) + window.scrollY - that.yOff
            ]

            // const [trueX, trueY] = [x - that.xOff, y - that.xOff]

            let [left, top] = [`${x}px`, `${y}px`]
            // let ` // (that['y-offset'] ?? that.defaultYOff) + 'px'// (that['x-offset'] ?? that.defaultXOff) + 'px'

            const selfElement = that.self.$el // document.querySelector('#hcard')
            const selfHeight = selfElement.getBoundingClientRect().height
            // const selfWidth = selfElement.getBoundingClientRect().width
            // console.log(selfHeight)

            // console.log(y, y + selfHeight, window.innerHeight)
            const offscreenMargin = 75
            const isOffscreenLeft = x + that.cardWidth > window.innerWidth - offscreenMargin
            const isOffscreenTop = y + selfHeight - window.scrollY > window.innerHeight - offscreenMargin
            // console.log(x - that.xOff, that.cardWidth, window.innerWidth)
            console.log(`left: ${x + that.cardWidth} (o: ?>) bounds: ${window.innerWidth - offscreenMargin}`)
            console.log(`top: ${y + selfHeight - window.scrollY} (o: ?>) bounds: ${window.innerHeight - offscreenMargin}`)

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
            console.log('width: ' + that.cardWidth)

            if (that.fromRight) {
              // console.log(left, that.cardWidth, left - that.cardWidth)
              left = `${x - that.cardWidth}px`
              // console.log(left, x, that.cardWidth)
            }

            console.log(`left: ${left}, top: ${top}`)

            // if (that.fromTop) {
            //   top = top + selfHeight
            // }

            // console.log(left, top)
            // that.top = top
            // const up = h // that.elHeight

            // console.log('e: ', ele)

            // const elee = that.noE
            // console.log('e: ', ele, elee.clientHeight)
            // console.log(`l: ${left}, t: ${top}, up: ${up}`)

            // if (bottom) {
            //   that.cardCSS = { left, bottom }
            // } else {
            //   that.cardCSS = { left, top }
            // }

            that.cardCSS = { left, top }
          }, 0)
        } else {
          console.log('killed preview')
          that.enablePreview = false
          this.lastElementHTML = null
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
    word-break: normal; /* maybe !important  */
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
