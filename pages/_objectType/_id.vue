<template>
  <div>
    <page-title>
      {{ dataObject.name }}
    </page-title>

    <v-row>
      <v-col cols="8">
        <page-section-title>
          Summary
        </page-section-title>
        <v-list-item>
          <!-- eslint-disable vue/no-v-html -->
          <div v-html="$md.render(dataObject.description)" />
        </v-list-item>
      </v-col>
      <v-col cols="4">
        <v-card flat class="mt-10">
          <v-card-text>
            <p>
              <span class="font-weight-bold">ID:</span> {{ dataObject.id }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div v-for="dataKey in dataKeys" :key="dataKey">
      <v-list-group
        :value="true"
      >
        <template #activator>
          <page-section-title class="text-capitalize">
            {{ dataKey }}
          </page-section-title>
        </template>
        <div v-for="(d, i) in dataObject[dataKey]" :key="i">
          <v-list-item
            :nuxt="true"
            :to="`/${dataKey}/${d.id}`"
            v-if="typeof(d) === 'object'"
          >
            <v-list-item>
              <v-list-item-title>
                {{ d.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item>
              <v-list-item-title>
                TBD link to {{ d }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item>
        </div>
      </v-list-group>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data: ({ $config: { name }, $route: { params } }) => ({
    mitreTitle: name.mitre,
    objectType: params.objectType.substring(1), // x
    id: params.id,
    defaultDataObjectKeys: [
      'id',
      'object-type',
      'name',
      'description'
    ]
  }),
  head () {
    return {
      // title: `${this.title} List | ${this.mitreTitle}`
    }
  },
  computed: {
    ...mapGetters(['getDataObjects']),
    dataObject () {
      return this.$store.getters.getDataObjects[this.objectType]
        .find(t => t.id === this.id)
    },
    dataKeys () {
      // Object keys that are not default
      return Object.keys(this.dataObject).filter((value) => {
        return !this.defaultDataObjectKeys.includes(value)
      })
    }
  }
}
</script>
