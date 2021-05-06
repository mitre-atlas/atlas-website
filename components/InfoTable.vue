<template>
<div>

    <v-row>
      <v-col cols="8">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search for keywords"
          single-line
          hide-details
        />
      </v-col>
      <v-col cols="4">
        <v-switch
          v-if="this.$route.name === 'tactics' || this.$route.name === 'techniques'"
          v-model="showAdvMlOnly"
          label="Show only AdvML"
          class="pa-3"
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
    <template v-slot:[`item.id`]="{ item }">
       <nuxt-link
        :to="`/${$route.name}/${item.id}`"
        style="text-decoration: none;"
        :id="item.id"
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
      <div
        v-html="item.description"
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
  props: ['items'],
  data: () => ({
    // headers: [
    //   { value: 'id', text: 'ID', align: 'right' },
    //   { value: 'name', text: 'Name' },
    //   { value: 'description', text: 'Description' }
    // ],
    search: '',
    showAdvMlOnly: false
  }),
  computed: {
    headers () {
      return [
        {
          value: 'id',
          text: 'ID',
          align: 'right',
          filter: (value) => {
            // TODO Allow ID to still be searchable via logic
            if (this.showAdvMlOnly) {
              return value.startsWith('AML') && value.includes(this.search)
            }
            return true
          }
        },
        { value: 'name', text: 'Name', width: '25%' },
        { value: 'description', text: 'Description', sortable: false }
      ]
    }
  }
}
</script>

<style scoped>
span >>> a {
  text-decoration: none;
}
</style>
