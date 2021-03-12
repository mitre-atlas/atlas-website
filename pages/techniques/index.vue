<template>
<div>
  <div class="text-h2">{{title}}</div>
  <div class="text-body-1">{{description}}</div>
  <info-table :items="content.items" />
</div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const content = await $content('threat-matrix/techniques').only(['items']).fetch()

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
  data: () => ({
    title: 'Adversarial ML Techniques',
    description: 'Lists all techniques (sub-techniques are shaded).'
  })
}
</script>
