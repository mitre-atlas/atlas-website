<template>
  <div>
    <v-list-group
      v-for="(tactic, i) in tactics"
      :key="i"
      no-action
      >
      <template #activator>
        <v-list-item>
          // TODO Should this be its own component?  Similar to the one in DataSideNav
        </v-list-item>
      </template>
    </v-list-group>
  </div>
</template>
<script>
export default {
  name: 'TechniquesSideNavContent',
  props: ['techniques'],
  computed: {
    tactics () {
      return this.$store.getters.getDataObjectsByType('tactics')
    }
  }
}
</script>
