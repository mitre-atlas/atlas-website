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
          class="pt-3 pb-2"
        />
      </v-col>
      <v-col v-if="showFilterButton" cols="4">
        <v-switch
          v-if="this.$route.name === 'tactics' || this.$route.name === 'techniques'"
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
    <template v-slot:[`item.id`]="{ item }">
       <nuxt-link
        :to="`/${$route.name}/${item.id}`"
        :id="item.id"
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
    <template v-slot:[`item.name`]="{ item }">
       <nuxt-link
        :to="`/${$route.name}/${item.id}`"
        > {{ item.name }}
        </nuxt-link>
    </template>
    <template v-slot:[`item.description`]="{ item }">
      <div
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
  props: ['items', 'showFilterButton'],
  data: () => ({
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
          filter: (value, search, time) => {
            return this.showAdvMlOnly ? value.startsWith('AML') : true
          }
          // filter: (value, search, item) => {
          //   // if (this.showFilterButton) {
          //   //   if (this.showAdvMlOnly && search) {
          //   //     const rx = new RegExp(search, 'i')
          //   //     const includesQuery = (str) => { return str.search(rx) !== -1 }
          //   //     return value.startsWith('AML') && (includesQuery(item.description) || includesQuery(item.id) || includesQuery(item.name))
          //   //   } else if (this.showAdvMlOnly) {
          //   //     return value.startsWith('AML')
          //   //   }
          //   // } else if (search) {
          //   //   const rx = new RegExp(search, 'i')
          //   //   const includesQuery = (str) => { return str.search(rx) !== -1 }
          //   //   return value.startsWith('AML') && (includesQuery(item.description) || includesQuery(item.id) || includesQuery(item.name))
          //   // } else {
          //   //   return true
          //   // }
          //   // if (this.showAdvMlOnly && search) {
          //   //   const rx = new RegExp(search, 'i')
          //   //   const includesQuery = (str) => { return str.search(rx) !== -1 }
          //   //   return value.startsWith('AML') && (includesQuery(item.description) || includesQuery(item.id) || includesQuery(item.name))
          //   // } else if (this.showAdvMlOnly) {
          //   //   return value.startsWith('AML')
          //   // }
          //   // return true
          // }
        },
        { value: 'name', text: 'Name', width: '25%' },
        { value: 'description', text: 'Description', sortable: false }
      ]
    }
  }

  // methods: {
  //   queryHighlight (text) {
  //     let query = this.search
  //     if (!text || !query) { return text }
  //     query = query.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1') // makes it safe for a regex constructor by escaping special chars
  //     const rx = new RegExp(query, 'gi')
  //     const hText = text.replace(rx, '<span class="qHighlight">$&</span>')

  //     return hText
  //   }
  // }
}
</script>
