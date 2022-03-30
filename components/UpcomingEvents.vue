<template>
  <div>
    <page-section-title>
      Upcoming Events
    </page-section-title>

    <v-timeline
      id="event-timeline"
      :dense="$vuetify.breakpoint.mobile"
      :style="$vuetify.breakpoint.mobile ? '' : 'left: -25%'"
    >
      <!-- Bound props above hide the opposite slot containing date and location
      when the screen is small and move the entire timeline to the left on large screens. -->
      <v-timeline-item
        v-for="event in formattedEvents"
        :key="event.name"
        :color="`${event.color} ${colorModifier}`"
        small
        right
        :class="!$vuetify.breakpoint.mobile && event-timeline-item"
      >
        <!-- Left of timeline -->
        <template #opposite>
          <span
            :class="`text-h6 ${event.color}--text text--${colorModifier}`"
            v-text="event.date"
          />
          <div :class="`font-weight-light mb-4 ${event.color}--text text--${colorModifier}`">
            {{ event.location }}
          </div>
        </template>
        <!-- Right of timeline -->
        <div class="py-4">
          <a
            :class="`headline ${event.color}--text text--${colorModifier}`"
            :href="event.url"
            target="_blank"
          >
            {{ event.name }}
            <v-icon
              :color="`${event.color} ${colorModifier}`"
              x-small
            >
              mdi-open-in-new
            </v-icon>
          </a>
          <!-- Display date and location as subtitle if small screen -->
          <!-- Replaces "left of timeline" template contents -->
          <div
            v-if="$vuetify.breakpoint.mobile"
            :class="`font-weight-light mb-4 ${event.color}--text text--${colorModifier}`"
          >
            {{ event.date }} - {{ event.location }}
          </div>
          <div
            class="mt-3"
            v-html="$md.render(event.description)"
          />
        </div>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>
<script>
export default {
  name: 'UpcomingEvents',
  props: ['events'],
  data: () => ({
    // https://vuetifyjs.com/en/styles/colors/#material-colors
    colorModifier: 'darken-3'
  }),
  computed: {
    formattedEvents () {
      // Convert date field to readable format
      return this.events.map((event) => {
        event.date = event.date.toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
        )
        return event
      })
    }
  }
}
</script>
