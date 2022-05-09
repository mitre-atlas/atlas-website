<template>
  <div>
    <v-row>
      <v-col :cols="12">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search for keywords"
          single-line
          hide-details
          class="pt-3 pb-2"
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      hide-default-footer
      disable-pagination
    >
      <template #[`item.id`]="{ item }">
        <nuxt-link
          :id="item.id"
          :to="`/${$route.name}/${item.id}`"
        >
          <span v-if="'subtechnique-of' in item">
            <!-- Display only last numeric portion of ID for subtechniques -->
            {{ item.id.substring(item.id.lastIndexOf('.')) }}
          </span>
          <span v-else>
            {{ item.id }}
          </span>
        </nuxt-link>
      </template>
      <template #[`item.name`]="{ item }">
        <nuxt-link
          :to="`/${$route.name}/${item.id}`"
        >
          {{ item.name }}
        </nuxt-link>
      </template>
      <template #[`item.description`]="{ item }">
        <div
          v-if="isCaseStudy"
          class="my-3"
          v-html="$md.render(item.summary)"
        />
        <div
          v-else
          class="my-3"
          v-html="$md.render(item.description)"
        />
      </template>
    </v-data-table>

    <scroll-to-top-button />
  </div>
</template>

<script>
export default {
  name: 'InfoTable',
  props: ['items', 'isCaseStudy'],
  data: () => ({
    search: ''
  }),
  computed: {
    headers () {
      return [
        {
          value: 'id',
          text: 'ID',
          align: 'right'
        },
        { value: 'name', text: 'Name', width: '25%' },
        { value: 'description', text: 'Description', sortable: false }
      ]
    }
  }
}
</script>
