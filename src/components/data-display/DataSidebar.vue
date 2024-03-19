<template>
    <v-card
      flat
      class="mt-10"
    >
      <v-card-text class="text-body-2">
        <p class="pb-2">
          <span class="font-weight-bold">ID:</span> {{ dataObject.id }}
        </p>
        <p
          v-for="(relatedObjs, objectType) in dataObject.relatedObjects"
          :key="objectType"
        >
          <data-sidebar-entry :object-type="objectType" :related-objs="relatedObjs" />
        </p>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  
  import DataSidebarEntry from '@/components/data-display/DataSidebarEntry.vue';
  
  const { dataObject } = defineProps(["dataObject"]);
  
  </script>
  
  