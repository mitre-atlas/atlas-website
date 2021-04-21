<template>
<div>
  <v-data-table :headers="fields" :items="items">
    <template v-slot:[`item.id`]="{ item }">
       <nuxt-link :to="`/${$route.name}/${item.id}`">{{ item.id }}</nuxt-link>
    </template>
    <template v-slot:[`item.description`]="{ item }">
      <span v-html="item.description" />
    </template>
  </v-data-table>
</div>
</template>

<script>
export default {
  name: 'InfoTable',
  props: ['items'],
  data: () => ({
    fields: [
      { value: 'id', text: 'ID' },
      { value: 'name', text: 'Name' },
      { value: 'description', text: 'Description' }
    ]
  })
}
</script>
