<template>
  <div>
    <slot />
    <portal>
      <v-fade-transition>
        <div
          :is="isMobile ? 'v-overlay' : 'div'"
          v-if="
            (((isMouseHovering || isPreviewLingering) && !isMobile) ||
              (wasTouchHeld && isMobile)) &&
              !overrideDisable
          "
          id="preview-container"
          :style="isMobile ? {} : positioningCSS"
          @touchstart="() => (wasTouchHeld = false)"
          @contextmenu="event => event.preventDefault()"
        >
          <v-card
            id="preview-card"
            ref="preview-card"
            nuxt
            target="_blank"
            :href="targetLocation"
            :light="isMobile"
            @mouseenter="() => setMouseHoverStateOverSelf(true)"
            @mouseleave="() => setMouseHoverStateOverSelf(false)"
            @touchstart.native="() => (wasTouchHeld = false)"
            @contextmenu="event => event.preventDefault()"
          >
            <v-card-title>{{ targetDataObject.name }}</v-card-title>
            <v-card-subtitle>
              ATLAS {{ targetDataObject['object-type'] }} |
              {{ targetDataObject.id }}
            </v-card-subtitle>
            <v-card-text
              id="text-fade"
              v-html="$md.render(targetDataObject.description)"
            />
            <v-card-actions>
              <v-icon id="arrow-icon" ref="arrow-icon">
                mdi-arrow-right
              </v-icon>
              <v-icon id="link-icon" ref="link-icon">
                mdi-open-in-new
              </v-icon>
            </v-card-actions>
          </v-card>
        </div>
      </v-fade-transition>
    </portal>
  </div>
</template>

<script>
import { Portal, setSelector } from '@linusborg/vue-simple-portal' // Used for portaling the preview to a high parent for absolute positioning
import { dataObjectToPluralTitle } from '~/assets/dataHelpers.js'

setSelector('app') // Portals the preview inside the Vue App component; otherwise we wouldn't have styling

export default {
  name: 'HoverPreviewGroup',
  components: {
    Portal
  },
  // if isGroup is true, the component will attach event listeners to the children of its slot,
  // Currently only implemented for v-autocomplete.
  props: ['isGroup', 'dataObject'],
  data: () => ({
    // 'reload' only necessary for group mode
    reload: null, // This keeps track of the function that reloads items and reattached listeners. Need this because for some reason, upon selecting a menu option, the listeners detach
    overrideDisable: false, // Turn off the preview completely, eg. the user clicked an option
    isMouseHovering: false, // Is the mouse currently hovering over the target element?
    wasTouchHeld: false, // Is the target element currently under touch hold?
    isPreviewLingering: false, // Is the preview currently staying visible for a short time after the mouse is no longer hovering?
    targetElementRect: null, // Bounding box of the target element, used for positioning
    lingerThread: null, // Keeps track of the thread used for disabling the preview linger after a duration
    touchHoldThread: null, // Keeps track of duration of touch hold, upon completion will activate preview
    targetDataObject: {}, // The data object who's information will be displayed
    positioningCSS: {
      position: 'absolute',
      transition: 'top 0.5s, left 0.5s',
      left: '0px',
      top: '0px'
    }
  }),
  computed: {
    // Uses breakpoints to check if we are on mobile
    isMobile () {
      return ['xs', 'sm'].includes(this.$vuetify.breakpoint.name)
    },
    targetLocation () {
      // The location a user is sent to when they click the preview card
      return `/${dataObjectToPluralTitle(this.targetDataObject)}/${
        this.targetDataObject.id
      }`
    }
  },
  mounted () {
    // Group mode will attach listeners to every child
    // Note: to use on v-autocomplete, need eager prop on it
    if (this.isGroup) {
      this.reload = this.attachEventListenersToAutocomplete

      this.reload()
    } else {
      // Otherwise just attach listeners to the slot item
      this.connectEventListenersToTargetItems([
        {
          dataObject: this.dataObject,
          element: this.$slots.default[0].elm
        }
      ])
    }
  },
  methods: {
    attachEventListenersToAutocomplete () {
      // Below obtains references to the embeded list items of the v-autocomplete
      const autocompleteNode = this.$slots.default[0]
      const listItemDataObjects = autocompleteNode.componentInstance.allItems // The externally provided data objects that define the list elms
      const menuVueComponent = autocompleteNode.componentInstance.$refs.menu
      if (!menuVueComponent) {
        return
      } // This means the component is currently remounting, don't need to run
      this.$nextTick(() => {
        // Make sure all children are here before attaching
        const listItemVueComponents = // The internal list element children
          menuVueComponent.$children[0].$children[0].$children[0].$children
        const listItems = listItemVueComponents.map(
          // Link the data objects to the child elements
          (listItemVueComponent, index) => {
            return {
              dataObject: listItemDataObjects[index],
              element: listItemVueComponent.$el
            }
          }
        )
        // Connect event listeners to each of the list items
        this.connectEventListenersToTargetItems(listItems)
      })
    },
    // Processes the mouse events over target items
    catchMouseEvent (event, dataObject) {
      switch (event.type) {
        case 'mouseenter':
          // Enable the element if it was disabled before, if the user hovers over an option again
          this.overrideDisable = false
          this.targetElementRect = event.target.getBoundingClientRect()

          // This is to prevent the preview from appearing from 0,0 which looks kinda weird
          // Makes it appear from the middle instead
          if (!this.isMouseHovering) {
            this.positioningCSS.left = `${
              this.targetElementRect.left +
              this.targetElementRect.width / 2 +
              window.scrollX
            }px`
            this.positioningCSS.top = `${
              this.targetElementRect.top + window.scrollY
            }px`
          }

          this.targetDataObject = dataObject
          this.isMouseHovering = true
          this.positionPreview()
          break
        case 'mouseleave':
          // Start the linger timer if leave
          this.isMouseHovering = false
          this.startLingering()
          break
        case 'click':
          // Removes the preview if they click the element
          this.overrideDisable = true
          if (this.isGroup) {
            this.reload()
          }

          break
        case 'touchstart': {
          // Set the data object, clear the previous hold thread if it exists and start a new one
          this.targetDataObject = dataObject
          const holdDuration = 500
          clearTimeout(this.touchHoldThread)
          // Wait some time, and if the thread still exists, means the user is holding touch
          this.touchHoldThread = setTimeout(() => {
            this.wasTouchHeld = true
          }, holdDuration)
          break
        }
        case 'touchmove':
        case 'touchend':
          // If use moves (like swiping list) or stops holding, clear touch hold thread
          clearTimeout(this.touchHoldThread)
          break
      }
    },
    // Controls the appearance of the preview card. Calculates the correct offsets based on
    // viewport, window, and target item information as well as initiates a new thread for
    // linger control
    positionPreview () {
      // The purpose of setTimeout is to let me reference the component being rendered while it is rendering
      // otherwise, the component may not exist yet

      // The "this" and "that" business allows me to send a reference of "this" into the setTimeout thread,
      // the reference being called "that"

      if (this.isMobile) {
        return
      } // Don't try to do positioning on mobile
      setTimeout(
        (that) => {
          const anchorOffset = { x: 10, y: 10 } // Offset of the preview to the element
          const gutterSize = { x: 20, y: 20 } // Minimum whitepace required on the side of the preview
          const preferRight = true // Prefer the right of the preview to be attached to the item
          const preferTop = true // Prefer the top of the preview to be attached to the item
          const scrollbarOffset = 20 // Accounts for the scrollbar in the menu component
          const previewElement = that.$refs['preview-card'].$el // A referenece to our own component
          const previewElementRect = previewElement.getBoundingClientRect()
          const absoluteViewport = {
            // The bounds of our viewport in absolute terms
            x: window.innerWidth + window.scrollX,
            y: window.innerHeight + window.scrollY
          }
          // Calculate the absolute location of the target element
          const absoluteTargetRectLeft =
            window.scrollX + that.targetElementRect.left
          const absoluteTargetRectTop =
            window.scrollY + that.targetElementRect.top

          let leftOffset =
            absoluteTargetRectLeft - (previewElementRect.width + anchorOffset.x)
          let topOffset = absoluteTargetRectTop

          // If there's no space on the left, of the element, or we prefer the preview on the other side
          if (leftOffset < gutterSize.x || !preferRight) {
            leftOffset =
              absoluteTargetRectLeft +
              (that.targetElementRect.width + anchorOffset.x + scrollbarOffset)
          }

          // If there's no space below the element, or we prefer the preview on the other side
          if (
            topOffset + previewElementRect.height >
              absoluteViewport.y - gutterSize.y ||
            !preferTop
          ) {
            topOffset =
              absoluteTargetRectTop -
              previewElementRect.height +
              that.targetElementRect.height
          }

          // Set the CSS
          that.positioningCSS.left = `${leftOffset}px`
          that.positioningCSS.top = `${topOffset}px`
        },
        0, // Zero delay, since we just want parallel execution
        this // Reference to "this"
      )
    },
    // Handles what happens when the mouse goes to hover over the preview itself
    setMouseHoverStateOverSelf (newState) {
      if (newState) {
        this.isMouseHovering = true
      } else {
        this.startLingering()
      }

      this.transitionIcons()
    },
    // Allows the preview to maintain display for a short duration after the user has stopped hovering
    startLingering () {
      const lingerDuration = 500
      this.isMouseHovering = false
      this.isPreviewLingering = true
      // Kills the previous linger thread. Otherwise, moving your mouse rapidly over a list of items would
      // cause lingering to be prematurely ended
      clearTimeout(this.lingerThread)
      // Creates a new thread to end the preview after a short duration
      this.lingerThread = setTimeout(() => {
        this.isPreviewLingering = false
      }, lingerDuration)
    },
    connectEventListenersToTargetItems (targetItems) {
      // For each of the target items, attach the necessary event listeners
      const connectedEvents = [
        'mouseenter',
        'mouseleave',
        'click',
        'touchstart',
        'touchend',
        'touchmove'
      ]
      targetItems.forEach((targetItem) => {
        connectedEvents.forEach((eventName) => {
          targetItem.element.addEventListener(eventName, event =>
            this.catchMouseEvent(event, targetItem.dataObject)
          )
        })
      })
    },
    // Just styling and fanciness
    transitionIcons () {
      // Arrow icon, eg the -->
      const arrowIcon = this.$refs['arrow-icon'] && this.$refs['arrow-icon'].$el
      // Link icon, eg the [/^]
      const linkIcon = this.$refs['link-icon'] && this.$refs['link-icon'].$el

      // Short circuit in case elements don't exist (transitioning out)
      if (!arrowIcon || !linkIcon) {
        return
      }
      const activeColor = 'rgb(100, 181, 246)'
      const inactiveColor = 'rgba(0, 0, 0, 0.54)'

      // CSS for different arrow states
      const unhoveredCSS = {
        arrowIcon: {
          transform: 'rotate(0deg)',
          color: inactiveColor,
          opacity: 1
        },
        linkIcon: {
          transform: 'rotate(180deg)',
          color: inactiveColor,
          opacity: 0
        }
      }
      const hoveredCSS = {
        arrowIcon: {
          transform: 'rotate(180deg)',
          color: activeColor,
          opacity: 0
        },
        linkIcon: {
          transform: 'rotate(360deg)',
          color: activeColor,
          opacity: 1
        }
      }

      // Replace the css
      if (!this.isMouseHovering) {
        Object.assign(arrowIcon.style, unhoveredCSS.arrowIcon)
        Object.assign(linkIcon.style, unhoveredCSS.linkIcon)
      } else {
        Object.assign(arrowIcon.style, hoveredCSS.arrowIcon)
        Object.assign(linkIcon.style, hoveredCSS.linkIcon)
      }
    }
  }
}
</script>

<style scoped>
#preview-card {
  width: 400px;
}

#preview-container {
  padding: 0;
  margin: 0;
}
.v-card__text,
.v-card__title {
  word-break: normal;
  max-height: 500px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 20;
  -webkit-box-orient: vertical;
}

.v-overlay {
  z-index: 3000 !important;
}
.v-card-actions {
  position: relative;
}

#link-icon {
  opacity: 0;
  color: '#dc3545';
  transform: rotate(180deg);
}

.v-icon {
  transition: color 0.2s, font 0.2s, right 0.2s, bottom 0.2s, transform 0.2s,
    opacity 0.5s;
  position: absolute !important;
  right: 30px;
  bottom: 20px;
}

#text-fade {
  background: linear-gradient(
    160deg,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  display: inline-block;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
