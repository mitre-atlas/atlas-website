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
