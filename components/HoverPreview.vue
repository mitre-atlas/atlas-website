<template>
  <v-fade-transition v-if="!isMobile">
    <v-card
    id="hcard"
    ref="hcard"
    v-if="(enablePreview || keepPreviewEnabled)"
    nuxt
    target="_blank"
    :href="targetLocation"
    :width="cardWidth"
    elevation="24"
    @mouseenter="setPreviewSelf"
    @mouseleave="setPreviewSelf"
    :style="cardCSS">
      <v-card-title>{{ targetInfo.name }}</v-card-title>
      <v-card-subtitle>{{ (isTargetATTACK ? 'ATT&CK ' : 'ATLAS ') + targetInfo['object-type']}} | {{ targetInfo.id }}</v-card-subtitle>
      <v-card-text v-if="targetInfo.description.length < characterLimit" v-html="$md.renderInline(formatDesc(targetInfo.description))"></v-card-text>
      <v-card-text v-else id="text-fade" v-html="$md.renderInline(formatDesc(targetInfo.description))"></v-card-text>
      <v-card-actions>
        <v-icon id="arrow-icon">mdi-arrow-right</v-icon>
        <v-icon id="link-icon">mdi-open-in-new</v-icon>
        <!-- :href="!targetLocation.startsWith('/') ? targetLocation : ''"
    :to="targetLocation.startsWith('/') ? targetLocation : ''" -->
        <!-- <v-icon v-if="isHoveringSelf && isTargetATTACK" id="attack-icon">mdi-open-in-new</v-icon> targetLocation.startsWith('/') <v-card-subtitle>{{ isTargetATTACK ? 'ATT&CK ' : 'ATLAS ' + targetInfo['object-type']}}, {{ targetInfo.id }}</v-card-subtitle> -->
      </v-card-actions> <!--  :style="iconCSS"  @click.native="disableOverlay"-->
      <div id="caret"></div>
    </v-card>
  </v-fade-transition>
  <v-fade-transition v-else>
    <v-overlay
    style="z-index: 3000;"
    v-if="enablePreview"

    @touchstart.native="disableOverlay"
    >
      <v-card
      v-if="enablePreview"
      style="z-index: 3000;"
      id="mhcard"
      ref="mhcard"
      target="_blank"
      :href="targetLocation"
      :width="cardWidth"
      outlined
      light
      >
        <v-card-title>{{ targetInfo.name }}</v-card-title>
        <v-card-subtitle>{{ (isTargetATTACK ? 'ATT&CK ' : 'ATLAS ') + targetInfo['object-type']}} | {{ targetInfo.id }}</v-card-subtitle>
        <v-card-text v-if="targetInfo.description.length < characterLimit" v-html="$md.renderInline(formatDesc(targetInfo.description))"></v-card-text>
        <v-card-text v-else id="text-fade" v-html="$md.renderInline(formatDesc(targetInfo.description))"></v-card-text>
        <v-card-actions>
          <v-icon id="arrow-icon">mdi-arrow-right</v-icon>
          <v-icon id="link-icon">mdi-open-in-new</v-icon>
          <!-- :href="!targetLocation.startsWith('/') ? targetLocation : ''"
      :to="targetLocation.startsWith('/') ? targetLocation : ''" -->
          <!-- <v-icon v-if="isHoveringSelf && isTargetATTACK" id="attack-icon">mdi-open-in-new</v-icon> targetLocation.startsWith('/') <v-card-subtitle>{{ isTargetATTACK ? 'ATT&CK ' : 'ATLAS ' + targetInfo['object-type']}}, {{ targetInfo.id }}</v-card-subtitle> -->
        </v-card-actions> <!--  :style="iconCSS" -->
      </v-card>
    </v-overlay>
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
    // isTargetATTACK: false,
    inputHoldThread: null,
    previewDebounce: false,
    targetId: null,
    isHoveringSelf: false,
    cardWidth: 400,
    enablePreview: false,
    keepPreviewEnabled: false,
    mousePosition: { x: 0, y: 0 },
    isHovering: false,
    baseYOffset: 64,
    holdDuration: 750,
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
      if (this.isMobile) {
        this.setPreviewMobile(mouseEvent)
      } else {
        this.setPreview(mouseEvent)
      }
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
    isTargetATTACK () { return !this.targetId.includes('AML.') },
    isTargetATTACKTechnique () { return this.isTargetATTACK && this.targetInfo['object-type'] === 'technique' },
    characterLimit () { return this.maxLineHeight * 50 },
    targetLocation () {
      if (this.isTargetATTACKTechnique) {
        // ATT&CK subtechniques are a level in from their parent techniques,
        // i.e. https://attack.mitre.org/techniques/T1078/004/ vs. ATLAS's
        const attackIdUrl = this.targetInfo.id.replace('.', '/')
        return `https://attack.mitre.org/techniques/${attackIdUrl}`
      } else {
        return `/${this.targetInfo['object-type']}s/${this.targetId}`
      }
    },
    isMobile () { return ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) }, // TODO: change this, might not be robust enough
    targetInfo () {
      return (
        this.$store.getters.getTacticById(this.targetId) ||
        this.$store.getters.getTechniqueById(this.targetId))
    }
  },
  methods: {
    disableOverlay (event) {
      // console.log('overlay:', event.type)
      this.enablePreview = false
    },
    setDebounce (that = this) {
      // console.log('debounce enabled!')
      that.previewDebounce = true
      setTimeout(function () { that.previewDebounce = false }, that.delay)
    },
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
      const arrowIcon = document.querySelector('#arrow-icon')
      const linkIcon = document.querySelector('#link-icon')
      // const attackLinkColor = '#dc3545'
      const linkColor = 'rgb(100, 181, 246)'
      const inactiveColor = 'rgba(0, 0, 0, 0.54)'
      let iconSize = 24
      const factor = 1.2
      if (enablePreview) {
        if (this.previewDebounce) { return }
        this.isHoveringSelf = true
        // if (this.isTargetATTACKTechnique) {
        arrowIcon.style.transform = 'rotate(180deg)'
        arrowIcon.style.color = linkColor
        arrowIcon.style.opacity = 0
        linkIcon.style.color = linkColor
        linkIcon.style.transform = 'rotate(360deg)'
        linkIcon.style.opacity = 1
        // } else {
        // icon.style.color = linkColor // light blue
        // }
        iconSize *= factor
        this.keepPreviewEnabled = true
      } else {
        this.isHoveringSelf = false
        // if (this.isTargetATTACKTechnique) {
        arrowIcon.style.transform = 'rotate(0deg)'
        arrowIcon.style.color = inactiveColor
        arrowIcon.style.opacity = 1
        linkIcon.style.color = inactiveColor
        linkIcon.style.transform = 'rotate(180deg)'
        linkIcon.style.opacity = 0
        // setTimeout(function () { attackIcon.style.opacity = 1 }, 75)
        // } else {
        // arrowIcon.style.color = inactiveColor
        // }
        this.selfThread = setTimeout((that) => {
          this.selfThread = null
          if (!this.isHoveringSelf && !this.isHovering) {
            that.keepPreviewEnabled = false
            that.setDebounce(that)
          }
        }, this.delay, this)
      }
      const iconOffset = iconSize * (-5 / 8) + 45
      arrowIcon.style.font = `normal normal normal ${iconSize}px/1 "Material Design Icons"`
      linkIcon.style.font = `normal normal normal ${iconSize}px/1 "Material Design Icons"`
      arrowIcon.style.right = `${iconOffset}px`
      linkIcon.style.right = `${iconOffset}px`
      arrowIcon.style.bottom = `${iconOffset - 10}px`
      linkIcon.style.bottom = `${iconOffset - 10}px`
    },
    setPreviewMobile (event) {
      const eventName = event.type
      // const listElem = event.target
      console.log('spm got:', eventName)
      // const cancelContextMenu = event => event.preventDefault()
      // const disablePreviewEvents = ['mouseleave', 'wheel']
      // const enablePreview = !disablePreviewEvents.includes(eventName)
      // const previouslyDisabled = !(this.enablePreview || this.keepPreviewEnabled)
      // if (eventName === 'mousemove') { this.mousePosition = { x: event.pageX, y: event.pageY }; return }
      // if (eventName === 'click') { this.enablePreview = false; this.keepPreviewEnabled = false; return }
      clearTimeout(this.inputHoldThread)
      // console.log('mobile event of' + eventName, this.holdDuration)
      if (eventName === 'touchstart') {
        // console.log('previeous thread killed, new started')
        // clearTimeout(this.inputHoldThread)
        this.inputHoldThread = setTimeout(function (that) {
          // console.log('Thread survived!')
          // const cancel = new TouchEvent('touchcancel')
          // console.log(cancel, listElem)
          // document.dispatchEvent(cancel)
          // document.addEventListener('contextmenu', (event) => { console.log(event.target); event.preventDefault() })
          // listElem.oncontextmenu = event => false
          document.oncontextmenu = event => false
          // document.addEventListener('contextmenu', cancelContextMenu)
          that.enablePreview = true
          that.targetId = that.newTargetId
          that.keepPreviewEnabled = false
        }, this.holdDuration, this)
      } else if (['touchend', 'touchcancel'].includes(eventName)) {
        // document.oncontextmenu = event => true
        setTimeout(function () { document.oncontextmenu = event => true }, 0) // i love this function
        // document.removeEventListener('contextmenu', cancelContextMenu)
        // document.addEventListener('contextmenu', function () { return true })
        // console.log('thread killed.')
        // clearTimeout(this.inputHoldThread)
      }
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

            const caret = document.querySelector('#caret')
            if (caret) {
              const caretSize = 15
              const caretCSS = {}
              caretCSS.width = `${caretSize}px`
              caretCSS.height = `${caretSize}px`
              caretCSS.display = 'block'
              // top: 0px;  left: calc(-1 * var(--size) + 2px);
              // caret.style['--size'] = `${caretSize}px`
              if (onLeft && onTop) {
                caretCSS.inset = `0px auto auto ${-caretSize + 2}px`
                // caretCSS.top = '0px'
                // caretCSS.left = `${-caretSize + 2}px`
                caretCSS.transform = 'scaleX(1) scaleY(1)'
                // console.log('caret pos: 1')
              } else if (!onLeft && onTop) {
                caretCSS.inset = `0px ${-caretSize + 2}px auto auto`
                // caretCSS.top = '0px'
                // caretCSS.right = `${-caretSize + 2}px`
                caretCSS.transform = 'scaleX(-1) scaleY(1)'
                // console.log('caret pos: 2')
              } else if (onLeft && !onTop) {
                caretCSS.inset = `auto auto 0px ${-caretSize + 2}px`
                // caretCSS.bottom = '0px'
                // caretCSS.left = `${-caretSize + 2}px`
                caretCSS.transform = 'scaleX(1) scaleY(-1)'
                // console.log('caret pos: 3')
              } else {
                caretCSS.inset = `auto ${-caretSize + 2}px 0px auto`
                // caretCSS.bottom = '0px'
                // caretCSS.right = `${-caretSize + 2}px`
                caretCSS.transform = 'scaleX(-1) scaleY(-1)'
                // console.log('caret pos: 4')
              }

              for (const key in caretCSS) {
                caret.style[key] = caretCSS[key]
              }
            }

            // console.log(caret, caret.style, caretCSS)

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
              // console.log('hmmm', previouslyDisabled)
              selfElement.style.top = top
              // that.cardCSS.top = top
            }, previouslyDisabled ? 0 : 50)
            that.cardCSS = { left }
            // console.log(currentTop)
          }, 0)
        } else {
          // console.log('killed preview')
          // console.log('Trying to kill; parent,', that.enablePreview, that.keepPreviewEnabled, that.isHovering, that.isHoveringSelf)
          that.enablePreview = false
          that.setDebounce(that)

          if (that.keepPreviewEnabled) {
            // console.log("Couldn't kill;", that.selfThread, that.isHoveringSelf)
            if (!that.selfThread && !that.isHoveringSelf) {
              // console.log('Killed a hanging persistence')
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
  #hcard {
    position: absolute;
    transition: top 0.5s, left 0.5s, height 0.5s;;
    /* clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 100%, 5% 6%); */
    /* top: 1px; */
  }

  .v-overlay {
    z-index: 3000;
  }

  .v-card {
    z-index: 3000;
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

  #link-icon {
    opacity: 0;
    color: '#dc3545';
    transform: rotate(180deg)
  }

  .v-icon {
    transition: color 0.2s, font 0.2s, right 0.2s, bottom 0.2s, transform 0.2s, opacity 0.5s;
    position: absolute !important;
    right: 30px;
    bottom: 20px;
  }

  #caret {
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
