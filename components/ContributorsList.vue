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
/**
 * Renders a list of contributors with expandable content on the Contribute page.
 */
export default {
  name: 'ContributorsList',
  props: [
    /**
     * List of organizations and their contributors to render.
     * @type {Object}
     */
    'contributors'
  ]
}
</script>
