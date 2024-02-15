<template>
  <div>
    <PageSectionTitle :pageTitle="title"/>
    <v-row>
      <v-col :cols="`${mdAndUp ? 2 : 12}`">
        <UpdatesTable></UpdatesTable>
      </v-col>
      <v-col cols="10">
        <!-- Suspense is used to allow for await in the child component -->
        <Suspense>
          <UpdateContent :date="date"></UpdateContent>
         </Suspense>
      </v-col>
    </v-row>

  </div>
</template>

<script setup>
import PageSectionTitle from "@/components/PageSectionTitle.vue"
import UpdatesTable from "@/components/UpdatesTable.vue"
import UpdateContent from '@/components/UpdateContent.vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from "vue-router";

const route = useRoute()
const { date } = route.params

// mobile boolean for contitional rendering
const { mdAndUp } = useDisplay()

const title = ref('Updates')
</script>
