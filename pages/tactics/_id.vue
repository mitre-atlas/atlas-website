<template>
<div>
  <div class="text-h2">{{info.name}}</div>
  <p>{{info.description}}</p>
  <v-card>
    <v-card-text>
      <span class="font-weight-bold">ID:</span> {{info.id}}
    </v-card-text>
  </v-card>
</div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    console.log(params.id)
    // const content = await $content('threat-matrix/tactics_full').only(['items']).fetch()
    const content = await $content('threat-matrix/tactics')
      .only(['items'])
      // .where({
      //   'items.id': { $eq: params.id } // This isn't working - perhaps only supported for JSON
      // })
      .fetch()
      .catch((err) => {
        console.log(err)
      })

    // Find the first info that contains the specified ID
    const info = content.items.find(info => info.id.includes(params.id))

    // Consider creating a link out of the ID, parsing out the last element
    console.log(info)

    return { info }
  }
}
</script>
