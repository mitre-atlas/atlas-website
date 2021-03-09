<template>
  <div>
    <h1>{{title}}</h1>
    <p>{{description}}</p>

    <b-table bordered hover :fields="fields" :items="items">
      <template #cell()="data">
        <span v-html="data.value"></span>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const tactics = await $content('threat-matrix/tactics_full').only(['items']).fetch()
    const techniques = await $content('threat-matrix/techniques_full').only(['items']).fetch()

    // Consider creating a link out of the ID, parsing out the last element
    tactics.items.forEach((value, index, array) => {
      // Parse out true ID if ID string is fully qualified
      if (value.id.includes('.')) {
        array[index].id = value.id.split('.').pop()
      }
    })
    // TODO Don't repeat
    techniques.items.forEach((value, index, array) => {
      // Parse out true ID if ID string is fully qualified
      if (value.id.includes('.')) {
        array[index].id = value.id.split('.').pop()
      }
    })

    // Use the tactic names in order as the table columns
    const fields = tactics.items.map(item => item.name)

    // Construct the table items

    // Group techniques by their tactic
    // { tactic_name: [ technique objs ] }
    const groupedTechniques = techniques.items.reduce((retVal, obj) => {
      // There is only one tactic, listed as an array TODO Confirm
      const tacticId = obj.tactics[0]
      // Look up the tactic name and use it to key into the items for the table
      // Recall that the info.id is the actual ID portion and tacticID is the full version
      const tactic = tactics.items.find(info => tacticId.includes(info.id))
      if (tactic === undefined) {
        // TODO Handle TA0005 from Valid Accounts (deleted for now)
        console.log('*** Could not find tactic with ID ' + tacticId)
      }
      retVal[tactic.name] = (retVal[tactic.name] || []).concat(obj)
      return retVal
    }, {})

    console.log(Object.keys(groupedTechniques))

    // Massage into matrix table

    // Find the largest number of techniques, which will be the number of rows
    const techniquesByTactic = Object.values(groupedTechniques)
    let numRows = 0
    techniquesByTactic.forEach((ts) => { if (ts.length > numRows) { numRows = ts.length } })
    // 22

    console.log(techniquesByTactic.length)

    // Fill out the square matrix
    techniquesByTactic.forEach((value, index, array) => {
      if (value.length < numRows) {
        const numRowsToAdd = numRows - value.length
        // console.log(numRowsToAdd)
        const dummyArray = Array(numRowsToAdd).fill({
          id: '',
          name: ''
        })
        array[index] = value.concat(dummyArray)
      }
    })

    // Transpose the matrix to get cols as tactics
    const transpose = m => m[0].map((x, i) => m.map(x => x[i]))
    const matrix = transpose(techniquesByTactic)

    // Massage the data to reflect links and fit the key-value table format
    // Assume that these are in order
    const items = matrix.map((rows, index) => {
      const obj = {}
      // Zip up the column names with the values
      fields.forEach((fieldName, i) => {
        // Get the technique meant to be at this table index
        const technique = matrix[index][i]

        // Format technique into a link
        const link = '<a href="../techniques/' + technique.id + '">' + technique.name + '</a>'

        // Assign link as content of this column name
        obj[fieldName] = link
      })
      return obj
    })

    console.log(items)

    return { items, fields }
  },
  data: () => ({
    title: 'Adversarial ML Matrix',
    description: 'Below are the tactics and techniques representing the adversarial machine learning threat matrix.',
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' }
    ]
  })
}
</script>
