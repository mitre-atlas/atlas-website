<template>

  <div v-if="study != undefined">
    <div class="pa-3">
      <div class="text-h3 pa-10">
        {{ study.name }}
        <v-chip
          class="ma-1 ml-3 text-capitalize"
          :color="study['case-study-type'] === 'exercise' ? 'blue' : 'purple'"
          :text-color="study['case-study-type'] === 'exercise' ? 'blue' : 'purple'"
          label
          variant="outlined"
          :prepend-icon="study['case-study-type'] === 'exercise' ? 'mdi-clipboard-file-outline' : 'mdi-alert-circle-outline'"
        >
          {{ study['case-study-type'] }}
        </v-chip>
      </div>

      <v-row class="pl-12">
        <v-col cols="12" sm="5" md="7">
          <span> Incident Date:&nbsp; </span>
          <span v-if="study['incident-date']" class="font-weight-bold">
            {{ formattedIncidentDate }}&nbsp;
          </span>
          <span v-if="study.reporter">
            | Reporter:&nbsp;
          </span>
          <span v-if="study.reporter" class="font-weight-bold">
            {{ study.reporter }}
          </span>
          <br>
          <span> Actor:&nbsp; </span>
          <span v-if="study.actor" class="font-weight-bold">
            {{ study.actor }}&nbsp;
          </span>
          <span> | Target:&nbsp; </span>
          <span v-if="study.target" class="font-weight-bold">
            {{ study.target }}
          </span>
        </v-col>
        <v-spacer />
        <v-col class="text-right">
          <DownloadDataDropdown :study="study" />
        </v-col>
      </v-row>

      <p class="text-h5  mt-10 ml-6"> 
          Summary
      </p>
      <p 
        class="text-body-1  pl-3 ml-6" 
        v-html="md.render(study.summary)" 
      />

      <br>
      <v-divider class="pb-10" />

      <v-row align="center">
        <v-col>
          <div class="text-h5 ml-6 text-capitalize"
          > 
            Procedure
          </div>
        </v-col>
        <v-col class="text-right">
          <NavigatorLayerDropdown :study="study" />
        </v-col>
      </v-row>

      <v-row>
        <ProcedureTimeline :study="study" />
      </v-row>

      <div v-if="study.references && study.references.length > 0" class=" ml-6">
        <p class="text-h5  mt-10"> 
          Sources
        </p>
        <div v-for="reference in study.references" :key="reference.url" class="pl-3 mb-2">
          <a v-if="reference.url && reference.title" :href="reference.url" target="_blank" rel="noopener noreferrer">
            {{ reference.title || reference.url }}
            <v-icon icon="mdi-open-in-new" size="small" />
          </a>
          <div v-else-if="reference.title">
            {{ reference.title }}
          </div>
        </div>
      </div>

    </div>
  </div>
  <div v-else>
    <!-- Display ErrorNotFound if ID is not found -->
    <ErrorNotFoundView />
  </div>
</template>
  
<script setup>
  import { useMain } from "@/stores/main"
  import { useRoute } from 'vue-router'
  import { computed } from 'vue' 
  import ErrorNotFoundView from "./ErrorNotFoundView.vue"
  import { formatCaseStudyIncidentDate } from '@/assets/tools.js'
  import ProcedureTimeline from '@/components/ProcedureTimeline.vue'
  import DownloadDataDropdown from '@/components/DownloadDataDropdown.vue'
  import NavigatorLayerDropdown from '@/components/NavigatorLayerDropdown.vue'

  import markdownit from 'markdown-it'
  const md = markdownit({
    html: true
  })

  const mainStore = useMain()

  // Collect the plural of the object type (tactics, techniques, etc) and the object ID from the URL
  const route = useRoute()
  let { id } = route.params

  const study = computed(() => {
    return mainStore.getDataObjectById(id)
  })

  const formattedIncidentDate = computed(() => {
    return formatCaseStudyIncidentDate(study.value)
  })

  
</script>
  