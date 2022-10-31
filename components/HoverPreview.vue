<template>
  <div @contextmenu="event => event.preventDefault()">
    <slot />
    <portal :is="isMobile ? 'div' : 'portal'">
      <v-fade-transition>
        <v-overlay
          :is="isMobile ? 'v-overlay' : 'div'"
          v-if="isPreviewEnabled"
          class="preview-container"
          :style="isMobile ? {} : positioningCSS"
          @touchstart="wasTouchHeld = false"
          @contextmenu="event => event.preventDefault()"
          @click="wasTouchHeld = false"
        >
          <v-card
            ref="preview-card"
            class="preview-card"
            nuxt
            target="_blank"
            :disabled="overrideDisable"
            :href="targetDataObject.route"
            :light="isMobile"
            :style="cardStyle"
            @mouseenter="() => setMouseHoverStateOverSelf(true)"
            @mouseleave="() => setMouseHoverStateOverSelf(false)"
            @touchstart.native="wasTouchHeld = false"
            @contextmenu="event => event.preventDefault()"
          >
            <v-card-title>{{ getLabelById(targetDataObject.id) || targetDataObject.name }}</v-card-title>
            <v-card-subtitle class="text-capitalize">
              {{ targetDataObject['object-type'] }} |
              {{ targetDataObject.id }}
            </v-card-subtitle>
            <v-card-text v-html="$md.render(targetDataObject.description)" />
            <v-card-actions>
              <v-icon ref="arrow-icon" class="arrow-icon">
                mdi-arrow-right
              </v-icon>
              <v-icon ref="link-icon" class="link-icon">
                mdi-open-in-new
              </v-icon>
            </v-card-actions>
          </v-card>
        </v-overlay>
      </v-fade-transition>
    </portal>
  </div>
</template>

<script>
import { Portal, setSelector } from '@linusborg/vue-simple-portal' // Used for portaling the preview to a high parent for absolute positioning

setSelector('app') // Portals the preview inside the Vue App component; otherwise we wouldn't have styling

export default {
  name: 'HoverPreview',
  components: {
    Portal
  },
  // if isAutocomplete is true, the component will attach event listeners to the children of its slot,
  props: ['isAutocomplete', 'isListGroup', 'dataObjects'],
  data: () => ({
    isMobile: false,
    // 'reload' only necessary for group mode
    reload: null, // This keeps track of the function that reloads items and reattached listeners. Need this because for some reason, upon selecting a menu option, the listeners detach
    overrideDisable: false, // Turn off the preview completely, eg. the user clicked an option
    isMouseHovering: false, // Is the mouse currently hovering over the target element?
    wasTouchHeld: false, // Is the target element currently under touch hold?
    isPreviewLingering: false, // Is the preview currently staying visible for a short time after the mouse is no longer hovering?
    targetElementRect: null, // Bounding box of the target element, used for positioning
    hoverThread: null, // Keeps track of the thread used for enabling mouse hover after a duration
    lingerThread: null, // Keeps track of the thread used for disabling the preview linger after a duration
    touchHoldThread: null, // Keeps track of duration of touch hold, upon completion will activate preview
    targetDataObject: {}, // The data object who's information will be displayed
    positioningCSS: {
      position: 'absolute',
      transition: 'top 0.5s, left 0.5s',
      left: 0,
      top: 0,
      'z-index': 3000
    },
    // Changes attributes for display
    displayOptions: {
      preferRight: true, // Prefer the top of the preview to be attached to the item
      preferTop: true, // Prefer the right of the preview to be attached to the item
      cardWidth: '600px',
      attachmentDirection: 'horizontal', // Whether to put the card beside the element or on top/below it
      attachmentOffset: { x: 10, y: 10 }, // Offset of the preview to the element
      gutterSize: { x: 20, y: 20 }, // Minimum whitepace required on the side of the preview
      scrollbarOffset: 20, // Accounts for the scrollbar in the menu component
      hoverDelay: 250, // Delay from mouseover -> preview shows
      lingerDuration: 500 // Delay from mouseleave -> preview goes away
    }
  }),
  computed: {
    // Uses breakpoints to check if we are on mobile
    // Sets the card style programatically, to handle mobile screens and different
    // display options
    isPreviewEnabled () {
      return (
        (this.isMouseHovering || this.isPreviewLingering || this.wasTouchHeld) &&
        !this.overrideDisable
      )
    },
    cardStyle () {
      const styleOptions = {
        width: this.displayOptions.cardWidth,
        'max-width': '80vw'
      }
      if (this.isMobile) {
        styleOptions.margin = 'auto'
      }

      return styleOptions
    }
  },
  mounted () {
    // Group mode will attach listeners to every child
    // Note: to use on v-autocomplete, need eager prop on it
    if (this.isAutocomplete) {
      this.reload = this.attachEventListenersToAutocomplete
    } else if (this.isListGroup) {
      this.displayOptions.attachmentDirection = 'vertical'
      this.reload = this.attachEventListenersToListGroup
    } else {
      // Otherwise just attach listeners to the slot item
      this.connectEventListenersToTargetItems([
        {
          dataObject: this.dataObjects,
          element: this.$slots.default[0].elm
        }
      ])
    }
    if (this.reload) {
      this.reload()
    }
  },
  methods: {
    attachEventListenersToListGroup () {
      const listGroupNode = this.$slots.default[0]
      const listItemElements = Array.from(
        listGroupNode.elm.children[1].children
      )
      const listItems = listItemElements.map(
        // Link the data objects to the child elements
        (listItemElement, index) => {
          return {
            dataObject: this.dataObjects[index],
            element: listItemElement
          }
        }
      )
      this.connectEventListenersToTargetItems(listItems)
    },
    attachEventListenersToAutocomplete () {
      // Below obtains references to the embeded list items of the v-autocomplete
      const autocompleteNode = this.$slots.default[0]
      autocompleteNode.elm.addEventListener('focusout', event =>
        this.catchMouseEvent(event, null)
      )
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
          // We're not in mobile mode if we detect mouse input
          if (!this.isPreviewEnabled) {
            this.isMobile = false
          }
          // Clear any previous hover thread, start a new one
          // Hover thread is used to implement a delay before the preview shows
          clearTimeout(this.hoverThread)
          this.hoverThread = setTimeout(() => {
            // Enable the element if it was disabled before, if the user hovers over an option again
            this.overrideDisable = false
            this.targetElementRect = event.target.getBoundingClientRect()

            // This is to prevent the preview from appearing from 0,0 which looks kinda weird
            // Makes it appear from the middle instead
            if (!(this.isMouseHovering || this.isPreviewLingering)) {
              if (this.positioningCSS.left === 0) {
                // == 0 means not assigned yet by positionPreview
                this.positioningCSS.left = `${
                  this.targetElementRect.left +
                  this.targetElementRect.width / 2 +
                  window.scrollX
                }px`
                this.positioningCSS.top = `${
                  this.targetElementRect.top + window.scrollY
                }px`
              }
            }

            this.targetDataObject = dataObject
            this.isMouseHovering = true
            this.positionPreview()
          }, this.displayOptions.hoverDelay)
          break
        case 'mouseleave':
          // Clear the hover thread, since the user is no longer hovering
          clearTimeout(this.hoverThread)
          // Start the linger timer if leave
          this.startLingering()
          break
        case 'focusout':
        case 'click':
          // Removes the preview if they click or click out of the element
          if (this.isMobile) {
            // Don't register this event on mobile (fires on long press, messes with preview state)
            return
          }
          this.overrideDisable = true
          if (this.isAutocomplete) {
            this.reload()
          }

          break
        case 'touchstart': {
          // If we detect touch input, enable mobile mode
          if (!this.isPreviewEnabled) {
            this.isMobile = true
          }
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
    getLabelById (id) {
      return this.$store.getters.getDataObjectById(id).label
    },
    // Controls the appearance of the preview card. Calculates the correct offsets based on
    // viewport, window, and target item information as well as initiates a new thread for
    // linger control
    positionPreview () {
      // The purpose of setTimeout is to let me reference the component being rendered while it is rendering
      // otherwise, the component may not exist yet

      if (this.isMobile) {
        return
      } // Don't try to do positioning on mobile
      setTimeout(
        () => {
          const previewElement = this.$refs['preview-card'].$el // A referenece to our own component
          const previewElementRect = previewElement.getBoundingClientRect()
          const absoluteViewport = {
            // The bounds of our viewport in absolute terms
            x: window.innerWidth + window.scrollX,
            y: window.innerHeight + window.scrollY
          }
          // Calculate the absolute location of the target element
          const absoluteTargetRectLeft =
            window.scrollX + this.targetElementRect.left
          const absoluteTargetRectTop =
            window.scrollY + this.targetElementRect.top
          let leftOffset
          let topOffset

          // If we are attaching the preview to the side of the target elemement,
          if (this.displayOptions.attachmentDirection === 'horizontal') {
            leftOffset =
              absoluteTargetRectLeft -
              (previewElementRect.width +
                this.displayOptions.attachmentOffset.x)
            topOffset = absoluteTargetRectTop
            // If there's no space on the left of the element, or we prefer the left of the preview to be attached
            if (
              leftOffset < this.displayOptions.gutterSize.x ||
              !this.displayOptions.preferRight
            ) {
              leftOffset =
                absoluteTargetRectLeft +
                (this.targetElementRect.width +
                  this.displayOptions.attachmentOffset.x +
                  this.displayOptions.scrollbarOffset)
            }
            // If there's no space below the element, or we prefer bottom of the preview to be attached
            if (
              topOffset + previewElementRect.height >
                absoluteViewport.y - this.displayOptions.gutterSize.y ||
              !this.displayOptions.preferTop
            ) {
              topOffset =
                absoluteTargetRectTop -
                previewElementRect.height +
                this.targetElementRect.height
            }
            // Otherwise, if we are attaching the preview to the top or bottom of the target element
          } else if (this.displayOptions.attachmentDirection === 'vertical') {
            leftOffset =
              absoluteTargetRectLeft +
              this.targetElementRect.width -
              previewElementRect.width
            topOffset =
              absoluteTargetRectTop -
              (previewElementRect.height +
                this.displayOptions.attachmentOffset.y)
            // TODO: Change "prefer" logic to be more consistent with 'horizontal' (right now its flipped)
            // If there's no space above the element, or we prefer the top of the preview to be attached
            if (
              topOffset < this.displayOptions.gutterSize.y + window.scrollY ||
              !this.displayOptions.preferTop
            ) {
              topOffset =
                absoluteTargetRectTop +
                this.targetElementRect.height +
                this.displayOptions.attachmentOffset.y
              const distanceBelowScreen =
                absoluteTargetRectTop +
                previewElementRect.height -
                (document.body.scrollHeight - this.displayOptions.gutterSize.y)
              // If there's no space below (and above) the element, make a compromise and position it in the middle
              if (distanceBelowScreen > 0) {
                topOffset = absoluteTargetRectTop - distanceBelowScreen
              }
            }
            // If we prefer the right of the preview to be attached
            if (!this.displayOptions.preferRight) {
              leftOffset = absoluteTargetRectLeft
            }
          }
          // Set the CSS
          this.positioningCSS.left = `${leftOffset}px`
          this.positioningCSS.top = `${topOffset}px`
        },
        0 // Zero delay, since we just want parallel execution
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
      if (this.isMouseHovering) {
        this.isPreviewLingering = true
      }
      this.isMouseHovering = false
      // Kills the previous linger thread. Otherwise, moving your mouse rapidly over a list of items would
      // cause lingering to be prematurely ended
      clearTimeout(this.lingerThread)
      // Creates a new thread to end the preview after a short duration
      this.lingerThread = setTimeout(() => {
        this.isPreviewLingering = false
      }, this.displayOptions.lingerDuration)
    },
    connectEventListenersToTargetItems (targetItems) {
      // For each of the target items, attach the necessary event listeners
      const connectedEvents = [
        'mouseenter',
        'mouseleave',
        'click',
        'touchstart',
        'touchend',
        'touchmove',
        'focusout'
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
      // CSS in raw values, so I can compute offsets to keep things centered when changing sizes
      const inactiveColor = 'rgba(0, 0, 0, 0.54)'
      const activeColor = 'rgb(100, 181, 246)'
      const inactiveIconSize = 25
      const activeIconSize = 30
      const inactiveIconOffset = {
        bottom: 20,
        right: 30
      }
      const sizingPositioningOffset = (activeIconSize - inactiveIconSize) / 2
      const activeIconOffset = {
        bottom: inactiveIconOffset.bottom - sizingPositioningOffset,
        right: inactiveIconOffset.right - sizingPositioningOffset
      }

      // CSS for different arrow states
      const inactiveIconCSS = {
        arrowIcon: {
          transform: 'rotate(0deg)',
          color: inactiveColor,
          opacity: 1,
          right: `${inactiveIconOffset.right}px`,
          bottom: `${inactiveIconOffset.bottom}px`,
          'font-size': `${inactiveIconSize}px`
        },
        linkIcon: {
          transform: 'rotate(180deg)',
          color: inactiveColor,
          opacity: 0,
          right: `${inactiveIconOffset.right}px`,
          bottom: `${inactiveIconOffset.bottom}px`,
          'font-size': `${inactiveIconSize}px`
        }
      }
      const activeIconCSS = {
        arrowIcon: {
          transform: 'rotate(180deg)',
          color: activeColor,
          opacity: 0,
          right: `${activeIconOffset.right}px`,
          bottom: `${activeIconOffset.bottom}px`,
          'font-size': `${activeIconSize}px`
        },
        linkIcon: {
          transform: 'rotate(360deg)',
          color: activeColor,
          opacity: 1,
          right: `${activeIconOffset.right}px`,
          bottom: `${activeIconOffset.bottom}px`,
          'font-size': `${activeIconSize}px`
        }
      }
      // Replace the css
      if (!this.isMouseHovering) {
        Object.assign(arrowIcon.style, inactiveIconCSS.arrowIcon)
        Object.assign(linkIcon.style, inactiveIconCSS.linkIcon)
      } else {
        Object.assign(arrowIcon.style, activeIconCSS.arrowIcon)
        Object.assign(linkIcon.style, activeIconCSS.linkIcon)
      }
    }
  }
}
</script>

<style scoped>
.preview-container {
  padding: 0;
  margin: 0;
}
.v-card__text,
.v-card__title {
  word-break: normal;
  max-height: 15vh;
  text-overflow: ellipsis;
  overflow: hidden;
}
.v-card__title {
  max-height: 20%
}
.v-card__text::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(
    transparent 15vh,
    rgba(255, 255, 255, 0.7),
    white
  );
}
.v-overlay {
  z-index: 3000 !important;
}
.v-card-actions {
  position: relative;
}
.link-icon {
  opacity: 0;
  color: '#dc3545';
  transform: rotate(180deg);
}
.v-icon {
  transition: color 0.3s, font 0.3s, right 0.3s, bottom 0.3s, transform 0.3s,
    opacity 0.5s;
  position: absolute !important;
  right: 30px;
  bottom: 20px;
}
::v-deep a {
  color: inherit;
}
</style>
