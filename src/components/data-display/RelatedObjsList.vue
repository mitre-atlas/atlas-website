<template>
  <div v-for="(d, i) in itemsList" :key="i">
    <span v-if="'route' in d" :key="getLabelById(d.id)">
      <!-- Case Studies -->
      <v-list-group
        :value="getLabelById(d.id)"
        v-if="'object-type' in d && d['object-type'] == 'case-study'"
      >
        <template v-slot:prepend>
          <v-icon :icon="mdi - link"></v-icon>
        </template>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <div>
              {{ getLabelById(d.id) }}
              <v-btn
                icon="mdi-link"
                size="small"
                :to="d.route"
                variant="plain"
                color="blue"
              ></v-btn>
            </div>
          </v-list-item>
        </template>
        <v-list-item>
          <ProcedureTimeline :study="study(d.id)" />
        </v-list-item>
      </v-list-group>
      <!-- Any other subset of items -->
      <v-list-item v-else :key="getLabelById(d.id)" :to="d.route" class="pb-1 pt-1 mb-2">
        <div v-html="getLabelById(d.id)"></div>
      </v-list-item>
    </span>
  </div>
</template>

<script setup>
import { useMain } from '@/stores/main'
import ProcedureTimeline from '@/components/ProcedureTimeline.vue'
import { computed } from 'vue'
const mainStore = useMain()

const props = defineProps([
  /**
   * Data object that these items apply to
   * @type {Object}
   */
  'parentObject',
  /**
   * Data objects of itemType related to the parent object
   * @type {Object[]}
   */
  'items',
  /**
   * Data object type or a hyphen-delimited title
   * @todo LW Revisit the hyphen-delimited title idea
   * @type {String}
   */
  'itemType'
])

/**
 * Items sorted by ID in alphabetical order
 * @type {Object[]}
 */
const itemsList = computed(() => {
  const source = Array.isArray(props.items) ? [...props.items] : []
  return source.sort((a, b) => (a.id > b.id ? 1 : -1))
})

const labelById = computed(() => {
  const result = new Map()
  itemsList.value.forEach((item) => {
    const obj = mainStore.getDataObjectById(item.id)
    result.set(item.id, obj?.label || obj?.name || item.name)
  })
  return result
})

/**
 * Returns the `label` of the specified object ID
 * @todo LW Is `label` available in the related objs info? Why query?
 * @param {String} id - Data object ID
 */
const getLabelById = (id) => {
  return labelById.value.get(id) || id
}

const study = (id) => {
  return mainStore.getDataObjectById(id)
}
</script>
