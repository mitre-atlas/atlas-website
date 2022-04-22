<!-- Sidebar on individual data pages displaying ID and other summaries -->
<template>
  <v-card
    flat
    class="mt-10"
  >
    <v-card-text>
      <p>
        <span class="font-weight-bold">ID:</span> {{ dataObject.id }}
      </p>
      <p
        v-for="(relatedObjs, dataKey) in relatedObjects"
        :key="dataKey"
      >
        <span class="font-weight-bold">Number of {{ dataKey }}:</span> {{ relatedObjs.length }}
      </p>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'DataSidebar',
  props: ['dataObject', 'relatedObjects']
}
</script>
