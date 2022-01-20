<template>
<div>
    <h1>{{version-doc}}</h1>
  <!-- <v-list dense>
    <div v-for="(item, i) in contributors" :key="i">
      <v-subheader>{{ item.organization }}</v-subheader>
      <v-list-item v-for="(name, j) in item.contributors" :key="j">
        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list> -->
</div>
</template>

<script>
export default {
  name: 'VersionDocumentation',
  props: ['version-doc']
}
</script>
