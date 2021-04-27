<template>
<div>
    <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
  />
  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    hide-default-footer
    disable-pagination
    >
    <template v-slot:[`item.id`]="{ item }">
       <nuxt-link
        :to="`/${$route.name}/${item.id}`"
        style="text-decoration: none;"
        >
        <span v-if="'subtechnique-of' in item">
          {{ item.id.substring(item.id.lastIndexOf('.')) }}
        </span>
        <span v-else>
          {{ item.id }}
        </span>
        </nuxt-link>
    </template>
    <template v-slot:[`item.name`]="{ item }">
       <nuxt-link
        :to="`/${$route.name}/${item.id}`"
        style="text-decoration: none;"
        >
          {{ item.name }}
        </nuxt-link>
    </template>
    <template v-slot:[`item.description`]="{ item }">
      <span v-html="item.description" />
    </template>
  </v-data-table>

  <scroll-to-top-button />
</div>
</template>

<script>
export default {
  name: 'InfoTable',
  props: ['items'],
  data: () => ({
    headers: [
      { value: 'id', text: 'ID', align: 'right' },
      { value: 'name', text: 'Name' },
      { value: 'description', text: 'Description' }
    ],
    search: ''
  })
}
</script>

<style scoped>
span >>> a {
  text-decoration: none;
}
</style>
