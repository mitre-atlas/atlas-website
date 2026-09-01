<template>
  <div>
    <PageSectionTitle :pageTitle="title" />
    <v-row>
      <v-col cols="12" md="2">
        <UpdatesTable></UpdatesTable>
      </v-col>
      <v-col cols="12" md="10">
        <!-- Suspense is used to allow for await in the child component -->
        <Suspense>
          <UpdateContent :date="date"></UpdateContent>
        </Suspense>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import PageSectionTitle from '@/components/PageSectionTitle.vue'
import UpdatesTable from '@/components/UpdatesTable.vue'
import UpdateContent from '@/components/UpdateContent.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { date } = route.params

const title = ref('Updates')
</script>
