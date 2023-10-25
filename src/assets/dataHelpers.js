/**
 * Helper functions for data objects.
 * @module dataHelpers
 */

import pluralize from 'pluralize'

/**
 * Pluralizes a data object type.  For use constructing page titles and object routes.
 * @example
 * // Truncated technique object
 * const techniqueObj = {
 *   id: 'AML.T0000',
 *   'object-type': 'technique'
 * }
 * // Title is 'techniques'
 * const techniqueTitle = dataObjectToPluralTitle(techniqueObj)
 *
 * // Object type field of a data object
 * const objectType = 'tactic'
 * // Title is 'tactics'
 * const title = dataObjectToPluralTitle(objectType)
 *
 * // Truncated case study object
 * const caseStudyObj = {
 *   id: 'AML.CS0000',
 *   'object-type': 'case-study'
 * }
 * // Title is 'case studies'
 * const caseStudyTitle = dataObjectToPluralTitle(caseStudyObj)
 * // Title is 'studies'
 * const caseStudyTruncatedTitle = dataObjectToPluralTitle(caseStudyObj, true)
 * @param {(object|string)} objectType - Data object or object type string
 * @param {boolean} [returnLastWordOnly=false] - Whether to return only the last word of the pluralization
 * @returns {string} A pluralization of the data object type
 */
export function dataObjectToPluralTitle (
  objectType,
  returnLastWordOnly = false
) {
  // Check if an object was passed as the arg, otherwise use the type as-is
  if (typeof objectType === 'object' && 'object-type' in objectType) {
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

/**
 * Generates a URL route to the provided data object.
 * @example
 * // Truncated case study object
 * const caseStudyObj = {
 *   id: 'AML.CS0000',
 *   'object-type': 'case-study'
 * }
 * // Route is '/studies/AML.CS0000'
 * const caseStudyRoute = dataObjectToRoute(caseStudyObj)
 *
 * // Truncated technique object
 * const techniqueObj = {
 *   id: 'AML.T0000',
 *   'object-type': 'technique'
 * }
 * // Route is '/techniques/AML.T0000'
 * const techniqueRoute = dataObjectToRoute(techniqueObj)
 * @param {object} obj - Data object
 * @returns {string} Route portion of the URL to the data object
 */
export function dataObjectToRoute (obj) {
  // Construct each route as a pluralization of the object type (last word) and the object ID
  // i.e. studies for case-study, techniques for technique
  const pluralLastWordOfObjectType = dataObjectToPluralTitle(obj, true)
  return `/${pluralLastWordOfObjectType}/${obj.id}`
}

export function isJavascriptObject (value) {
  // Note that arrays and null are also typed as object
  return typeof value === 'object' && !Array.isArray(value) && value != null
}

/**
 * Returns True if the argument represents an ATLAS data object.
 *
 * @param {object} value
 */
export function isDataObject (value) {
  return (
    isJavascriptObject(value) && 'object-type' in value && !('use' in value) // Can occur with technique use in mitigations
  )
}

/**
 * Returns True if the argument represents an array of ATLAS data objects.
 *
 * @param {object} value
 */
export function isDataObjectArray (value) {
  if (Array.isArray(value)) {
    // Check if it's an array of data objects
    return value.every(v => isDataObject(v))
  }

  return false
}
