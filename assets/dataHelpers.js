import pluralize from 'pluralize'

// Helper functions for data objects

export function dataObjectToPluralTitle (objectType, returnLastWordOnly = false) {
  // Check if an object was passed as the arg, otherwise use the type as-is
  if (typeof objectType === 'object') {
    objectType = objectType['object-type']
  }
  // Replace any dashes with spaces, i.e. case-study > case study
  const tokens = objectType.split('-')
  // Pluralize the last word
  const lastWordIndex = tokens.length - 1
  const pluralLastWord = pluralize(tokens[lastWordIndex])

  // Return just the last word if requested
  if (returnLastWordOnly) {
    return pluralLastWord
  }

  // Otherwise return entire plural string with spaces
  tokens[lastWordIndex] = pluralLastWord
  return tokens.join(' ')
}

export function dataObjectToRoute (obj) {
  // Construct each route as a pluralization of the object type (last word) and the object ID
  // i.e. studies for case-study, techniques for technique
  const pluralLastWordOfObjectType = dataObjectToPluralTitle(obj, true)
  return `/${pluralLastWordOfObjectType}/${obj.id}`
}

function getReferencedDataObjects (argObj) {
  // Returns an object with key/object-type to array of objects referenced by this object

  const defaultDataObjectKeys = [
    'id',
    'object-type',
    'name',
    'description'
  ]

  // Get object keys that may be references, i.e. are not default
  const dataKeys = Object.keys(argObj).filter((value) => {
    return !defaultDataObjectKeys.includes(value)
  })

  // IDs of objects directly referenced by this page's object
  const referencedObjects = {}
  dataKeys.forEach((key) => {
    const value = argObj[key]
    if (Array.isArray(value)) {
      referencedObjects[key] = value.map(id => this.$store.getters.getDataObjectById(id)).flat()
    } else {
      // Single value, create a single-element Array
      referencedObjects[key] = [this.$store.getters.getDataObjectById(value)]
    }
  })

  // Handle subtechnique-of title
  if ('subtechnique-of' in referencedObjects) {
    referencedObjects['parent-technique'] = referencedObjects['subtechnique-of']
    delete referencedObjects['subtechnique-of']
  }

  return referencedObjects
}

function getDataObjectsReferencing (argObj) {
  // Return an object with key/object-type to array of objects that reference this object

  const id = argObj.id

  // Find objects that reference this object's ID
  let objects = this.$store.getters.getDataObjects.filter((obj) => {
    return obj.id !== id && Object.values(obj).flat().includes(id)
  })

  // Other subtechniques
  if (argObj['object-type'] === 'technique' && 'subtechnique-of' in argObj) {
    const parentTechniqueId = id.substring(0, id.lastIndexOf('.'))
    const otherSubtechniques = this.$store.getters.getDataObjectsByTypeKeyValue('techniques', 'subtechnique-of', parentTechniqueId)
    // Add other subtechniques that aren't this one
    objects = objects.concat(otherSubtechniques.filter(t => t.id !== id))
  }

  // Add subtechniques of tactics to the technique list
  if (argObj['object-type'] === 'tactic') {
    let subtechniques = []
    objects.forEach((obj) => {
      if (obj['object-type'] === 'technique') {
        subtechniques = subtechniques.concat(this.$store.getters.getDataObjectsByTypeKeyValue('techniques', 'subtechnique-of', obj.id))
      }
    })
    objects = objects.concat(subtechniques)
  }

  // Look for case studies with the singular key in its procedure, i.e. technique or tactic
  if (argObj['object-type'] === 'tactic' || argObj['object-type'] === 'technique') {
    const studies = this.$store.getters.getDataObjectsByType('case-studies')
      .filter(study => study.procedure
        // singular key, i.e. technique vs. techniques
        .some(step => step[argObj['object-type']] === id)
      )

    objects = objects.concat(studies)
  }

  // Group by object type
  const results = objects.reduce(
    (acc, obj) => {
      let objectType = obj['object-type']
      if (!acc[objectType]) {
        acc[objectType] = []
      }
      acc[objectType].push(obj)
      return acc
    },
    {}
  )

  // Label subtechniques if available
  if ('technique' in results && argObj['object-type'] === 'technique') {
    let subtechniqueKey = 'subtechniques'
    if (argObj['object-type'] === 'technique' && 'subtechnique-of' in argObj) {
      subtechniqueKey = 'other subtechniques'
    }
    /* eslint-disable dot-notation */
    // Relabel the techniques found
    results[subtechniqueKey] = results['technique']
    delete results['technique']
    /* eslint-enable */
  }

  return results
}

export function getRelatedDataObjects (argObj) {
  // Returns an object of key/object-type to array of data objects related to this object
  return {
    ...getReferencedDataObjects(argObj),
    ...getDataObjectsReferencing(argObj)
  }
}
