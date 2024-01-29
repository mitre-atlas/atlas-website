<template>
  <v-list>
    <div v-for="(source, i) in sources" :key="i">
      <AddSource 
        v-if="i === editIndex"
        :editSource="source"
        :editIndex="editIndex"
        @cancel="editIndex = null"
        @update="emitUpdate"
      />
      <v-list-item v-else :value="i">
        {{ i + 1 }}.
        <span v-if="!source.url">{{ source.title }}</span>
        <span v-else>
          <a :href="source.url" target="_blank">{{ source.title || source.url }}</a>
          <v-icon icon="mdi-open-in-new" size="x-small" class="ml-1" />
        </span>
        <template v-slot:append>
          <v-icon icon="mdi-pencil" color="blue" class="mr-5" @click="editIndex = i" />
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" icon="mdi-delete" color="red" />
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title class="text-wrap">
                  Delete {{ source.title || source.url }}?
                </v-card-title>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    text="Cancel"
                    @click="isActive.value = false"
                  ></v-btn>
                  <v-btn
                    text="Delete"
                    color="red"
                    @click="isActive.value = false; $emit('delete', i)"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-list-item>
    </div>
  </v-list>
</template>

<script setup>
  import { ref } from 'vue'
  import AddSource from '@/components/case-study-form/AddSource.vue'

  const emit = defineEmits(['updateSource', 'delete'])
  const { sources } = defineProps([
    /**
     * Individual source object from source list
     * @type {Object}
     */
    'sources',
  ])

  const editIndex = ref()

  function emitUpdate(editedSource, index) {
    emit('updateSource', editedSource, index)
    editIndex.value = null
  }


</script>