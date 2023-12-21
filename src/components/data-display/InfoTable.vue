<template>
  <div>
    <div v-for="item in tableItems">
      {{ item.id }}
    </div>
  </div>
</template>

<script setup>

/**
 * Table containing an organized list of items of one object type.
 */
import { computed } from 'vue' 
import { useMain } from "@/stores/main"
const mainStore = useMain()


 const { objectTypePlural } = defineProps([
    /**
     * Data object type (e.g. tactics)
     * @type {String}
     */
    'objectTypePlural',
  ]);

  // TODO: figure out how to make this prop/this component update when the page is chaged (ex. from /tactics to /techniques)
  console.log(objectTypePlural)


  const tableItems = computed(() => {
      const obj = mainStore.getDataObjectsByType(objectTypePlural)
      return obj
  })

</script>

<style scoped>
</style>
