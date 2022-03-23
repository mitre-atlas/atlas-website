<template>
  <div>
    <v-list dense>
      <v-expansion-panels flat>
        <v-expansion-panel v-for="(item, i) in contributors" :key="i">
          <v-expansion-panel-header style="font-weight: bold">{{ item.organization }}</v-expansion-panel-header>
            <v-expansion-panel-content v-for="(name, j) in item.contributors" :key="j">
              <v-list-item-title style="font-size: 13px">{{ name }}</v-list-item-title>
            </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'ContributorsList',
  props: ['contributors']
}
</script>
