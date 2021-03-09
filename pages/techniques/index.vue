<template>
<div>
  <h1>{{title}}</h1>
  <p>{{description}}</p>
  <info-table :items="content.items" />
</div>
</template>

<script>
import InfoTable from '../../components/InfoTable.vue'

export default {
  async asyncData ({ $content }) {
    const content = await $content('threat-matrix/techniques_full').only(['items']).fetch()

    // Consider creating a link out of the ID, parsing out the last element
    content.items.forEach((value, index, array) => {
      // Parse out true ID if ID string is fully qualified
      if (value.id.includes('.')) {
        array[index].id = value.id.split('.').pop()
      }

      // Visibly indicate subtechniques
      if ('subtechnique-of' in value) {
        array[index]._rowVariant = 'secondary'
      }
    })

    return { content }
  },
  components: {
    InfoTable
  },
  data: () => ({
    title: 'Adversarial ML Techniques',
    description: 'Lists all techniques (sub-techniques are shaded).'
  })
}
</script>
