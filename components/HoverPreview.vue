<template>
  <v-fade-transition>
    <v-card
    style="z-index: 3000;"
    id="hcard"
    ref="hcard"
    v-if="(enablePreview || keepPreviewEnabled)"
    nuxt
    target="_blank"
    :to="targetLocation"
    :width="cardWidth"
    elevation="24"
    @mouseenter="setPreviewSelf"
    @mouseleave="setPreviewSelf"
    :style="cardCSS">
      <v-card-title>{{ targetInfo.name }}</v-card-title>
      <v-card-subtitle>{{ targetInfo['object-type']}}, {{ targetInfo.id }}</v-card-subtitle>
      <v-card-text v-if="targetInfo.description.length < characterLimit ">{{ formatDesc(targetInfo.description) }}</v-card-text>
      <v-card-text v-else id="text-fade">{{ formatDesc(targetInfo.description) }}</v-card-text>
      <v-card-actions><v-icon id="icon">mdi-arrow-right</v-icon></v-card-actions> <!--  :style="iconCSS" -->
      <div id="arrow"></div>
    </v-card>
  </v-fade-transition>
</template>

<script>
export default {
  name: 'HoverPreview',
  // props: ['x-off', 'y-off', 'delay', 'targetID', 'parentEvent'],
  props: {
    'x-off': { default: 0, type: Number },
    'y-off': { default: -50, type: Number }, // the 64 is the height of the topbar, -30 is so it wont overlap the text
    'parent-event': { default: null },
    appearRight: { default: false },
    fromRight: { default: false },
    appearBottom: { default: false },
    fromBottom: { default: false },
    newTargetId: { default: '', type: String },
    delay: { default: 500, type: Number }
  },
  data: () => ({
    // iconLarge: false,
    targetId: null,
    isHoveringSelf: false,
    cardWidth: 400,
    enablePreview: false,
    keepPreviewEnabled: false,
    mousePosition: { x: 0, y: 0 },
    isHovering: false,
    baseYOffset: 64,
    // lastTargetId: null,
    self: null,
    // characterLimit: 350, // <- (maxLineHeight * 50 = characterLimit)
    maxLineHeight: 7,
    thread: null,
    selfThread: null,
    // iconCSS: {},
    cardCSS: { left: '-1px', top: '-1px' }
    // lastPos: { left: 0, top: 0 }
  }),
  watch: {
    // watch x/y values for slide transition
    parentEvent (mouseEvent) {
      this.setPreview(mouseEvent)
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
    characterLimit () { return this.maxLineHeight * 50 },
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
        // text = text.slice(0, this.characterLimit) + '...'
        text = text + '...'
      }
      return text
    },
    setPreviewSelf (event) {
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const eventName = event.type
      const enablePreview = !disablePreviewEvents.includes(eventName)
      const icon = document.querySelector('#icon')
      let iconSize = 24
      // let iconOffset = iconSize * (-5/8) + 45
      const factor = 1.2
      if (enablePreview) {
        this.isHoveringSelf = true
        // console.log('Emitting keep: TRUE', `delay at ${this.delay}`)
        // this.$emit('keep-preview', true)
        // const icon = document.querySelector('#icon')
        // iconSize = 32
        iconSize *= factor
        // iconOffset = 25
        icon.style.color = 'rgb(100, 181, 246)' // light blue
        // icon.style.font = `normal normal normal ${iconSize}px/1 "Material Design Icons"`
        // icon.style.right = `${iconOffset}px`
        // icon.style.bottom = `${iconOffset - 10}px`
        // this.iconCSS = { color: '#64B5F6' }
        this.keepPreviewEnabled = true
        console.log('Preview locked!')
      } else {
        this.isHoveringSelf = false
        icon.style.color = 'rgba(0, 0, 0, 0.54)' // grey
        // this.iconCSS = {}
        // iconSize = 24
        // iconOffset = 30
        // icon.style.font = `normal normal normal ${iconSize}px/1 "Material Design Icons"`
        // icon.style.right = `${iconOffset}px`
        // icon.style.bottom = `${iconOffset - 10}px`
        this.selfThread = setTimeout((that) => {
          this.selfThread = null
          console.log('Trying to kill; self,', that.enablePreview, that.keepPreviewEnabled, ';', this.isHoveringSelf, this.isHovering)
          if (!this.isHoveringSelf) { // && !this.isHovering) {
            // console.log('Emitting keep: FALSE')
            // that.$emit('keep-preview', false)
            // console.log(that.enablePreview, that.keepPreviewEnabled)
            that.keepPreviewEnabled = false
          }
        }, this.delay, this)
      }
      const iconOffset = iconSize * (-5 / 8) + 45
      icon.style.font = `normal normal normal ${iconSize}px/1 "Material Design Icons"`
      icon.style.right = `${iconOffset}px`
      icon.style.bottom = `${iconOffset - 10}px`
    },
    setPreview (event) {
      const eventName = event.type
      const element = event.target
      const elementPos = element.getBoundingClientRect()
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const enablePreview = !disablePreviewEvents.includes(eventName)
      const previouslyDisabled = !(this.enablePreview || this.keepPreviewEnabled)
      if (eventName === 'mousemove') { this.mousePosition = { x: event.pageX, y: event.pageY }; return }
      if (eventName === 'click') { this.enablePreview = false; this.keepPreviewEnabled = false; return }
      this.isHovering = enablePreview
      // this.lastTargetId = this.currentTargetId
      // const intendedID = this.targetId
      // console.log(`${eventName} set hover status to ${this.isHovering}, lastHTML: ${this.targetId}`)
      // console.log(document.querySelector('#hcard'))
      // console.log('fru: ', h, this.elHeight, this.noE, document.querySelector('#hcard'))
      // console.log(`BEFORE (enabling? ${enablePreview}): TargetID: ${this.targetId}, LastTargetID: ${this.lastTargetId}, CurrentTargetID: ${this.currentTargetId}`)
      clearTimeout(this.thread)
      this.thread = setTimeout(function (that) {
        // console.log('finished waiting,', eventName, element, elementPos, this.targetId, disablePreviewEvents, enablePreview, that.lastTargetId)
        // console.log(`${eventName} wants to set ${enablePreview}, hover status at ${that.isHovering}`)
        // console.log(this.lastTargetId === this.targetId, enablePreview !== that.isHovering, 'CONDS')
        // console.log((that.lastTargetId === this.targetId, enablePreview !== that.isHovering)
        // console.log(`AFTER (enabling? ${enablePreview}): TargetID: ${that.targetId}, LastTargetID: ${that.lastTargetId}, CurrentTargetID: ${that.currentTargetId}, intended: ${intendedID}`)
        // if ((that.lastTargetId === that.targetId) && enablePreview !== that.isHovering) { return }
        // if ((that.lastTargetId !== that.targetId) && enablePreview === false) { return }
        // console.log((that.lastTargetId !== that.currentTargetId), that.keepPreviewEnabled, enablePreview)
        // if ((that.targetId === that.currentTargetId) && that.keepPreviewEnabled && enablePreview) { return }
        // console.log(eventName, !enablePreview, that.isHovering)
        // if (!enablePreview && that.isHovering) { return }

        if (enablePreview) {
          that.enablePreview = true
          that.targetId = that.newTargetId
          that.keepPreviewEnabled = false
          // console.log('p:', that.mousePosition.x)
          setTimeout(function () { // spawn a new thread so we can render AND get rendering info at the same time >:)
            if (!that.self) { return }
            // console.log(`To right? ${that.appearRight}; To bottom? ${that.appearBottom}`)
            // console.log(`From right? ${that.fromRight}; From bottom? ${that.fromBottom}`)
            const [x, y] = [
              (that.xOff === 0) ? that.mousePosition.x : (that.appearRight ? elementPos.right : elementPos.left) + that.xOff,
              (that.appearBottom ? elementPos.bottom : elementPos.top) + window.scrollY - (that.yOff + that.baseYOffset)
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
            let onLeft = true
            let onTop = true

            if (isOffscreenLeft) {
              // console.log('offscreen detected!')
              onLeft = false
              left = `${x - that.cardWidth}px`
            }
            // console.log(this.$refs)
            // console.log(that.self.height)
            if (isOffscreenTop) {
              onTop = false
              // console.log('offscreen detected!')
              // console.log(y, that.yOff, elementPos.height)
              // top = `${y - selfHeight - (5 * (that.yOff + that.baseYOffset))}px` // idk why but '5' just works lol
              top = `${y - selfHeight}px`
              // console.log(top)
            }
            // console.log('width: ' + that.cardWidth)
            if (that.fromRight) {
              onLeft = false
              // console.log(left, that.cardWidth, left - that.cardWidth)
              left = `${x - that.cardWidth}px`
              // console.log(left, x, that.cardWidth)
            }

            const arrow = document.querySelector('#arrow')
            if (arrow) {
              const arrowSize = 15
              const arrowCSS = {}
              arrowCSS.width = `${arrowSize}px`
              arrowCSS.height = `${arrowSize}px`
              arrowCSS.display = 'block'
              // top: 0px;  left: calc(-1 * var(--size) + 2px);
              // arrow.style['--size'] = `${arrowSize}px`
              if (onLeft && onTop) {
                arrowCSS.inset = `0px auto auto ${-arrowSize + 2}px`
                // arrowCSS.top = '0px'
                // arrowCSS.left = `${-arrowSize + 2}px`
                arrowCSS.transform = 'scaleX(1) scaleY(1)'
                // console.log('Arrow pos: 1')
              } else if (!onLeft && onTop) {
                arrowCSS.inset = `0px ${-arrowSize + 2}px auto auto`
                // arrowCSS.top = '0px'
                // arrowCSS.right = `${-arrowSize + 2}px`
                arrowCSS.transform = 'scaleX(-1) scaleY(1)'
                // console.log('Arrow pos: 2')
              } else if (onLeft && !onTop) {
                arrowCSS.inset = `auto auto 0px ${-arrowSize + 2}px`
                // arrowCSS.bottom = '0px'
                // arrowCSS.left = `${-arrowSize + 2}px`
                arrowCSS.transform = 'scaleX(1) scaleY(-1)'
                // console.log('Arrow pos: 3')
              } else {
                arrowCSS.inset = `auto ${-arrowSize + 2}px 0px auto`
                // arrowCSS.bottom = '0px'
                // arrowCSS.right = `${-arrowSize + 2}px`
                arrowCSS.transform = 'scaleX(-1) scaleY(-1)'
                // console.log('Arrow pos: 4')
              }

              for (const key in arrowCSS) {
                arrow.style[key] = arrowCSS[key]
              }
            }

            // console.log(arrow, arrow.style, arrowCSS)

            // console.log(left)
            // selfElement.style.top = '1px'
            // selfElement.style.transition = 'top 1s'
            // console.log(selfElement.style.top)
            // const currentTop = selfElement.style.top
            // console.log(previouslyDisabled, currentTop, top)
            // if (previouslyDisabled) {
            //   that.cardCSS = { top, left }
            // } else {
            //   setTimeout(function () { // settimeout is literal black magic
            //     selfElement.style.top = top
            //   }, 50)
            //   that.cardCSS = { left }
            // }

            setTimeout(function () { // settimeout is literal black magic
              selfElement.style.top = top
            }, previouslyDisabled ? 0 : 50)
            that.cardCSS = { left }
            // console.log(currentTop)
          }, 0)
        } else {
          // console.log('killed preview')
          console.log('Trying to kill; parent,', that.enablePreview, that.keepPreviewEnabled)
          that.enablePreview = false

          if (that.keepPreviewEnabled) {
            console.log("Couldn't kill;", that.selfThread, that.isHoveringSelf)
            if (!that.selfThread && !that.isHoveringSelf) {
              console.log('Killed a hanging persistence')
              that.keepPreviewEnabled = false
            }
          }
          // this.lastTargetId = null
        }
      }, this.delay, this)
    }
  }
}
</script>

<style scoped>
  .v-card {
    position: absolute;
    transition: top 0.5s, left 0.5s, height 0.5s;;
    /* clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 100%, 5% 6%); */
    /* top: 1px; */
  }

  .v-card__text, .v-card__title {
    word-break: normal;
  }

  .v-card__text {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box !important;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    white-space: normal;
  }

  .v-card-actions {
    position: relative;
  }

  .v-icon {
    transition: color 0.5s, font 0.5s, right 0.5s, bottom 0.5s;
    position: absolute;
    right: 30px;
    bottom: 20px;
  }

  #arrow {
    /* --size: 20px; */
    display: none;
    /* width: var(--size);
    height: var(--size); */
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    background-color: white;
    position: absolute;
  }
  /* .icon-hover {
  } */
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
