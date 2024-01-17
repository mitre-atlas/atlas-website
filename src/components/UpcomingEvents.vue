<template>
  <div>
    <div class="text-h5 mt-5"> Upcoming Events </div>

    <v-timeline
      :dense="mobile"
      side="end" 
      class="text-right"
    >
      <v-timeline-item
        max-width="1000"
        v-for="event in formattedEvents"
        :key="event.name"
        :dot-color="`${event.color}`"
        size="small"
      >
        <!-- Left of timeline -->
        <template #opposite>
          <span
            :class="`text-h6 text-${event.color} }`"
            v-text="event.date"
          />
          <div
            :class="`font-weight-light mb-4 text-${event.color}`"
          >
            {{ event.location }}
          </div>
        </template>
        <!-- Right of timeline -->
        <div class="py-4 text-left">
          <a
            :class="`headline text-${event.color}`"
            :href="event.url"
            target="_blank"
          >
            {{ event.name }}
            <v-icon :color="`${event.color}}`" x-small>
              mdi-open-in-new
            </v-icon>
          </a>
          <!-- Display date and location as subtitle if small screen -->
          <!-- Replaces "left of timeline" template contents -->
          <div
            v-if="mobile"
            :class="`font-weight-light mb-4 text-${event.color} text--${colorModifier}`"
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
  import { computed, inject } from 'vue'
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

</script>
