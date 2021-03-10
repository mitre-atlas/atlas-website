<template>
<div>
  <h1>{{info.name}}</h1>
  <p>{{info.description}}</p>

  <b-card>
    <b-card-text>
      <b>ID:</b> {{info.id}}

      <p v-if="'subtechnique-of' in info">
        <b>Sub-technique of:</b>
        {{info['subtechnique-of']}}
      </p>

      <p>
        <b>Tactics:</b> <span v-html=info.tactics />
      </p>
    </b-card-text>
  </b-card>
</div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    console.log(params.id)
    const content = await $content('threat-matrix/techniques_full')
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

    // Consider creating a link out of the tactics list, parsing out the last element as needed
    info.tactics = info.tactics.map((id) => {
      if (id.includes('.')) {
        id = id.split('.').pop()
      }
      return `<a href="/tactics/${id}">${id}</a>`
    })

    // Turn into list of links
    info.tactics = info.tactics.join(',')

    return { info }
  }
}
</script>
