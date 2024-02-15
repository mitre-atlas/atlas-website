<template>
  <div :class="`${mdAndUp ? 'text-right' : 'text-left'} pr-10 pt-7 `" style="min-width: 150px;">
      
      <div class="text-h6"> All Updates </div>
      <v-list>
        <v-list-item v-for="update in updates" 
          class="text-h6 pa-0 text-blue text-wrap"
          :to="update.route"
        >
        <div
          :to="update.route"
        >
        {{update.date}}
       </div>
      </v-list-item>
      </v-list>
  </div>
</template>
<script setup>
  import { useDisplay } from 'vuetify'

  // mobile boolean for contitional rendering
  const { mdAndUp } = useDisplay()
  const { updates } = defineProps([
    /**
     * A list of updates to diplay in a timeline.
     * @type {Object}
     */
    'updates'
  ]);

</script>
