<template>
<div>
  <b-table bordered hover :fields="fields" :items="items">
    <template #cell(id)="data">
       <b-link :href="data.item.id">{{data.item.id}}</b-link>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  name: 'InfoTable',
  props: ['items'],
  data: () => ({
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' }
    ]
  })
}
</script>
