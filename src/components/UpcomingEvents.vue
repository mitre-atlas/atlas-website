<template>
  <div>
    <v-timeline
      :dense="mobile"
      side="end" 
      class="text-right"
    >
      <v-timeline-item
        max-width="1000"
        v-for="event in formattedEvents"
        :key="event.name"
        :dot-color="getColor(event)"
        size="small"
      >
        <!-- Left of timeline -->
        <template v-if="!mobile" #opposite>
          <span
            :class="`text-h6 text-${getColor(event)} }`"
            v-text="event.date"
          />
          <div
            :class="`font-weight-light mb-4 text-${getColor(event)}`"
          >
            {{ event.location }}
          </div>
        </template>
        <!-- Right of timeline -->
        <div class="py-4 text-left">
          <a
            :class="`text-h5 text-${getColor(event)}`"
            :href="event.url"
            target="_blank"
          >
            {{ event.name }}
            <v-icon :color="getColor(event)" size="x-small">
              mdi-open-in-new
            </v-icon>
          </a>
          <!-- Display date and location as subtitle if small screen -->
          <!-- Replaces "left of timeline" template contents -->
          <div
            v-if="mobile"
            :class="`font-weight-light mb-4 text-${getColor(event)}`"
          >
            {{ event.date }} - {{ event.location }}
          </div>
          <div
            class="mt-3 tw-prose tw-max-w-none"
            v-html="md.render(event.description)"
          />
        </div>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup>
  import { useDisplay } from 'vuetify'
  import { computed, inject, ref } from 'vue'
  const md = inject('markdownit')

  // mobile boolean for contitional rendering
  const { mobile } = useDisplay()

  const { events } = defineProps([
    /**
     * A list of events to diplay in a timeline.
     * @type {Object}
     */
    'events'
  ]);

  const colorModifier = ref('darken-3')

  /**
   * Maps over all of the events and converts date field to readable format.
   * @returns {Object}
   */
    const formattedEvents = computed(() => {
    return events.map((event) => {
      event.date = event.date.toLocaleDateString('default', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      return event
    })
  })

  /**
   * Returns an events color class with the colorModifier (e.g indigo-darken-3)
   * Note (Jan 2024): In the current Vuetify3 black does not have a darken modifier so black will error out
   * @returns {string}
   */
  function getColor(event) {
    return (event.color + "-" + colorModifier.value)
  }
</script>
