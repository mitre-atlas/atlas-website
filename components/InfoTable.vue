<template>
  <div>
    <v-row>
      <v-col :cols="(showFilterButton) ? 8 : 12">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search for keywords"
          single-line
          hide-details
          class="pt-3 pb-2"
        />
      </v-col>
      <v-col v-if="showFilterButton" cols="4">
        <v-switch
          v-if="$route.name === 'tactics' || $route.name === 'techniques'"
          v-model="showAdvMlOnly"
          :label="`Show only ${$config.name.short}`"
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
            {{ item.id.substring(item.id.lastIndexOf('.')) }}
            <sup v-if="item.id.startsWith('T')" class="red--text text--darken-3 text-caption">
              &
            </sup>
          </span>
          <span v-else>
            {{ item.id }}
            <sup v-if="item.id.startsWith('T')" class="red--text text--darken-3 text-caption">
              &
            </sup>
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
    <template v-slot:[`item.description`]="{ item }">
      <div
        v-if="isCaseStudy"
        v-html="$md.render(item.summary)"
        class="my-3"
      />
      <div
        v-else
        v-html="$md.render(item.description)"
        class="my-3"
      />
    </template>
  </v-data-table>

    <scroll-to-top-button />
  </div>
</template>

<script>
export default {
  name: 'InfoTable',
  props: ['items', 'showFilterButton', 'isCaseStudy'],
  data: () => ({
    search: ''
  }),
  computed: {
    headers () {
      return [
        {
          value: 'id',
          text: 'ID',
          align: 'right',
          filter: (value, search, time) => {
            return this.showAdvMlOnly ? value.startsWith('AML') : true
          }
        },
        { value: 'name', text: 'Name', width: '25%' },
        { value: 'description', text: 'Description', sortable: false }
      ]
    }
  }
}
</script>
