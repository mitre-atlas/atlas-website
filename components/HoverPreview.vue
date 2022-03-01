<template>
  <v-fade-transition v-if="!isMobile">
    <v-card
      v-if="(enablePreview || keepPreviewEnabled)"
      id="hcard"
      ref="hcard"
      nuxt
      target="_blank"
      :href="targetLocation"
      :width="cardWidth"
      elevation="24"
      :style="cardCSS"
      @mouseenter="setPreviewSelf"
      @mouseleave="setPreviewSelf"
    >
      <v-card-title>{{ targetInfo.name }}</v-card-title>
      <v-card-subtitle>{{ (isTargetATTACK ? 'ATT&CK ' : 'ATLAS ') + targetInfo['object-type'] }} | {{ targetInfo.id }}</v-card-subtitle>
      <v-card-text v-if="targetInfo.description.length < characterLimit" v-html="$md.renderInline(formatDesc(targetInfo.description))" />
      <v-card-text v-else id="text-fade" v-html="$md.renderInline(formatDesc(targetInfo.description))" />
      <v-card-actions>
        <v-icon id="arrow-icon">
          mdi-arrow-right
        </v-icon>
        <v-icon id="link-icon">
          mdi-open-in-new
        </v-icon>
      </v-card-actions>
      <div id="caret" />
    </v-card>
  </v-fade-transition>
  <v-fade-transition v-else>
    <v-overlay
      v-if="enablePreview"
      style="z-index: 3000;"

      @touchstart.native="disableOverlay"
    >
      <v-card
        v-if="enablePreview"
        id="mhcard"
        ref="mhcard"
        style="z-index: 3000;"
        target="_blank"
        :href="targetLocation"
        :width="cardWidth"
        outlined
        light
      >
        <v-card-title>{{ targetInfo.name }}</v-card-title>
        <v-card-subtitle>{{ (isTargetATTACK ? 'ATT&CK ' : 'ATLAS ') + targetInfo['object-type'] }} | {{ targetInfo.id }}</v-card-subtitle>
        <v-card-text v-if="targetInfo.description.length < characterLimit" v-html="$md.renderInline(formatDesc(targetInfo.description))" />
        <v-card-text v-else id="text-fade" v-html="$md.renderInline(formatDesc(targetInfo.description))" />
        <v-card-actions>
          <v-icon id="arrow-icon">
            mdi-arrow-right
          </v-icon>
          <v-icon id="link-icon">
            mdi-open-in-new
          </v-icon>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-fade-transition>
</template>

<script>
/* eslint vue/prop-name-casing: "off" */
export default {
  name: 'HoverPreview',
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
    self: null,
    maxLineHeight: 7,
    thread: null,
    selfThread: null,
    cardCSS: { left: '-1px', top: '-1px' }
  }),
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

  updated () {
    // Puts preview in a really high parent so i can position absolutely relative to page
    const hcard = this.$refs.hcard
    if (hcard) {
      this.self = hcard
      const grandcestor = document.querySelector('.container').firstChild
      // console.log(vMainWrap, 'vmw')
      grandcestor.appendChild(this.$refs.hcard.$el)
    }
  },
  methods: {
    disableOverlay (event) {
      this.enablePreview = false
    },
    setDebounce (that = this) {
      that.previewDebounce = true
      setTimeout(function () { that.previewDebounce = false }, that.delay)
    },
    formatDesc (text) {
      const tagRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
      text = text.replace(tagRegex, '')
      if (text.length > this.characterLimit) {
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
      const linkColor = 'rgb(100, 181, 246)'
      const inactiveColor = 'rgba(0, 0, 0, 0.54)'
      let iconSize = 24
      const factor = 1.2
      if (enablePreview) {
        if (this.previewDebounce) { return }
        this.isHoveringSelf = true
        arrowIcon.style.transform = 'rotate(180deg)'
        arrowIcon.style.color = linkColor
        arrowIcon.style.opacity = 0
        linkIcon.style.color = linkColor
        linkIcon.style.transform = 'rotate(360deg)'
        linkIcon.style.opacity = 1

        iconSize *= factor
        this.keepPreviewEnabled = true
      } else {
        this.isHoveringSelf = false

        arrowIcon.style.transform = 'rotate(0deg)'
        arrowIcon.style.color = inactiveColor
        arrowIcon.style.opacity = 1
        linkIcon.style.color = inactiveColor
        linkIcon.style.transform = 'rotate(180deg)'
        linkIcon.style.opacity = 0

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

      clearTimeout(this.inputHoldThread)

      if (eventName === 'touchstart') {
        this.inputHoldThread = setTimeout(function (that) {
          document.oncontextmenu = event => false

          that.enablePreview = true
          that.targetId = that.newTargetId
          that.keepPreviewEnabled = false
        }, this.holdDuration, this)
      } else if (['touchend', 'touchcancel'].includes(eventName)) {
        setTimeout(function () { document.oncontextmenu = event => true }, 0)
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

      clearTimeout(this.thread)
      this.thread = setTimeout(function (that) {
        if (enablePreview) {
          that.enablePreview = true
          that.targetId = that.newTargetId
          that.keepPreviewEnabled = false

          setTimeout(function () { // spawn a new thread so we can render AND get rendering info at the same time >:)
            if (!that.self) { return }

            const [x, y] = [
              (that.xOff === 0) ? that.mousePosition.x : (that.appearRight ? elementPos.right : elementPos.left) + that.xOff,
              (that.appearBottom ? elementPos.bottom : elementPos.top) + window.scrollY - (that.yOff + that.baseYOffset)
            ]
            let [left, top] = [`${x}px`, `${y}px`]
            const selfElement = that.self.$el
            const selfHeight = selfElement.getBoundingClientRect().height

            const offscreenMargin = 75
            const isOffscreenLeft = x + that.cardWidth > window.innerWidth - offscreenMargin
            const isOffscreenTop = y + selfHeight - window.scrollY > window.innerHeight - offscreenMargin

            let onLeft = true
            let onTop = true

            if (isOffscreenLeft) {
              onLeft = false
              left = `${x - that.cardWidth}px`
            }

            if (isOffscreenTop) {
              onTop = false
              top = `${y - selfHeight}px`
            }

            if (that.fromRight) {
              onLeft = false
              left = `${x - that.cardWidth}px`
            }

            const caret = document.querySelector('#caret')
            if (caret) {
              const caretSize = 15
              const caretCSS = {}
              caretCSS.width = `${caretSize}px`
              caretCSS.height = `${caretSize}px`
              caretCSS.display = 'block'

              if (onLeft && onTop) {
                caretCSS.inset = `0px auto auto ${-caretSize + 2}px`
                caretCSS.transform = 'scaleX(1) scaleY(1)'
              } else if (!onLeft && onTop) {
                caretCSS.inset = `0px ${-caretSize + 2}px auto auto`
                caretCSS.transform = 'scaleX(-1) scaleY(1)'
              } else if (onLeft && !onTop) {
                caretCSS.inset = `auto auto 0px ${-caretSize + 2}px`
                caretCSS.transform = 'scaleX(1) scaleY(-1)'
              } else {
                caretCSS.inset = `auto ${-caretSize + 2}px 0px auto`
                caretCSS.transform = 'scaleX(-1) scaleY(-1)'
              }

              for (const key in caretCSS) {
                caret.style[key] = caretCSS[key]
              }
            }

            setTimeout(function () {
              selfElement.style.top = top
            }, previouslyDisabled ? 0 : 50)

            that.cardCSS = { left }
          }, 0)
        } else {
          that.enablePreview = false
          that.setDebounce(that)

          if (that.keepPreviewEnabled) {
            if (!that.selfThread && !that.isHoveringSelf) {
              that.keepPreviewEnabled = false
            }
          }
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
    display: none;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    background-color: white;
    position: absolute;
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
