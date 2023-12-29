/**
 * Helper functions for case study builder and display functionality.
 * @module tools
 */

import path from 'path'
import { dump } from 'js-yaml'
import { validate } from 'jsonschema'

import schema from '../../public/atlas-data/dist/schemas/atlas_website_case_study_schema.json'
import { EXTRA_ADDED_WEBSITE_KEYS } from '../stores/main'

/**
 * Capitalizes the first letter of the provided string.
 * @example
 * capitalize('hello world!') // Hello world!
 * @param {string} str
 * @returns {string}
 */
export function capitalize (str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

/**
 * Splits text into array, capitalizes each word, joins into one string
 * @param {string} str
 * @param {string} splitter
 * @returns {string}
 */
export function capitalizeSidebar (str, splitter) {
  const tokens = str.split(splitter)
  for (let i = 0; i < tokens.length; i++) {
    tokens[i] = capitalize(tokens[i])
  }
  return tokens.join(' ')
}

/**
 * Finds last word in a string
 * @param {string} str
 * @returns {string}
 */
export function lastWord (str) {
  const textArr = str.split(' ')
  return textArr[textArr.length - 1]
}

/**
 * Generates a 12-digit UUID-like string for case study file metadata use,
 * to uniquely identify each downloaded file.
 * @example
 * generateID() // 'fcac-f4ba-d65b'
 * @param {string} [template='xxxx-xxxx-xxxx]
 * @returns {string}
 */
export function generateID (template = 'xxxx-xxxx-xxxx') {
  // *NOT* RFC compliant, use this where the uniqueness isn't so important
  // adapted from stackoverflow
  return template.replace(/x/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Internal holder for deprecation error messages.
 */
const depArray = []
/**
 * Adds an error message if case study contains deprecated fields as labeled in the schema.
 * @see {@link https://github.com/tdegrunt/jsonschema#pre-property-validation-hook}
 */
function preValidateProperty (object, key, schema, options, ctx) {
  if (schema.deprecated && key in object) {
    depArray.push('Deprecation Error: ' + schema.depMessage)
  }
}

/**
 * Converts `jsonschema` validation result errors to strings for display.
 * Used by {@link validFormatYAML}
 * @see {@link https://github.com/tdegrunt/jsonschema#results} for ValidatorResult and ValidationError docs
 * @param {ValidationError[]} errors - Array of `jsonschema` library ValidationError objects from the ValidationResult
 * @returns {string[]}
 */
function getErrorList (errors) {
  const errorArrayLength = errors.length
  // let errorMessages = 'File Errors: '
  const errorListSimplified = []
  // Iterates through error list to populate a new list that only contains user friendly (more readable) error messages
  for (let i = 0; i < errorArrayLength; i++) {
    if (!(errors[i].stack).includes('subschema') && !(errors[i].stack).includes('constant: null')) {
      errorListSimplified.push('File Error: ' + errors[i].stack)
    }
  }
  return errorListSimplified
}

/**
 * Verifies if user uploaded case study yaml file is in correct format for use in case builder
 * @param {object} yamlObj - Object read from uploaded case study YAML file
 * @returns {(string[]|string)}} Array of error strings for display or empty string @todo Check on this
 */
export function validFormatYAML (yamlObj) {
  depArray.length = 0
  const validObj = validate(yamlObj, schema, { nestedErrors: true, preValidateProperty })
  // If yaml file format is valid
  if (validObj.valid) {
    if (depArray.length !== 0) {
      return depArray
    }
    return ''
  }
  // Else output error messages for user to correct formatting
  return depArray.length !== 0 ? getErrorList(validObj.errors).concat(depArray) : getErrorList(validObj.errors)
}

/**
 * Verifies if user uploaded case study yaml file is up to date schema version
 * @param {object} yamlObj - Object read from uploaded case study YAML file
 * @returns {boolean}
 */
export function isSchemaOutdated (yamlObj) {
  return yamlObj.meta.version !== schema.$version
}

/**
 * Returns a formatted date string from a case study object's incident date and granularity fields.
 * For use in date rendering on the website and PowerPoints.
 * @example
 * // Truncated case study object
 * const obj = {
 *  'incident-date': Date('2022-01-02')
 * }
 *
 * obj['incident-date-granularity'] = 'YEAR'
 * formatCaseStudyIncidentDate(obj) // '2022'
 *
 * obj['incident-date-granularity'] = 'MONTH'
 * formatCaseStudyIncidentDate(obj) // 'January 2022'
 *
 * obj['incident-date-granularity'] = 'DATE'
 * formatCaseStudyIncidentDate(obj) // 'January 2, 2022'
 * @param {object} caseStudy - Object as created by the case study builder
 * @returns {string} Long-form representation of the incident date
 */
export function formatCaseStudyIncidentDate (caseStudy) {
  // Returns a string date in locale format

  const date = caseStudy['incident-date']
  const dateGranularity = caseStudy['incident-date-granularity']

  let dateOptions = null

  if (dateGranularity === 'YEAR') {
    dateOptions = { timeZone: 'UTC', year: 'numeric' }
  } else if (dateGranularity === 'MONTH') {
    dateOptions = { timeZone: 'UTC', year: 'numeric', month: 'long' }
  } else if (dateGranularity === undefined || dateGranularity === 'DATE') {
    // If dateGranularity is DATE, or there is no date granularity
    dateOptions = {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  }

  return date.toLocaleDateString('default', dateOptions)
}

/**
 * Allows the browser to download the provided text to the provided filename.
 * @param {string} filename - Filename including extension
 * @param {object} text - Object representing file contents
 */
export function download (filename, text) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plaincharset=utf-8,' + encodeURIComponent(text)
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

/**
 * Trims any whitespace around string values. Helper function for downloadStudyFile function.
 * @param {string} key
 * @param {string} value
 * @returns {string} Trimmed value
 */
const trimStrings = function (key, value) {
  if (typeof value === 'string') {
    return value.trim()
  }
  return value
}

/**
 * Formats and downloads the provided case study object as a YAML file.
 * @param {object} study - Case study data object from case study builder
 * @param {string} filename - Filename without extension
 */
export function downloadStudyFile (study, filename) {
  const studyCopy = Object.assign({}, study)
  EXTRA_ADDED_WEBSITE_KEYS.forEach(key => delete studyCopy.study[key])
  const studyYAML = dump(studyCopy, { replacer: trimStrings }).replace(
    'T00:00:00.000Z',
    ''
  )
  download(`${filename}.yaml`, studyYAML)
}

/**
 * Allows the browser to download a remote file specified by URL.
 * For use serving files on GitHub.
 * @param {string} url
 */
export function downloadUrlAsFile (url) {
  // Downloads a file located at url
  // Parameter url is a string
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = function () {
    let a = document.createElement('a')
    a.href = window.URL.createObjectURL(xhr.response) // xhr.response is a blob
    const urlSegments = url.split('/');
    const basename = urlSegments[urlSegments.length - 1];
    a.download = basename;
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a = null
  }
  xhr.open('GET', url)
  xhr.send()
}

/**
 * Allows the browser to open the provided URL in a new tab.
 * @param {string} url
 */
export function openNewTab (url) {
  window.open(url, '_blank')
}

/**
 * Creates and sets metadata for case studies built by the website.
 * @param {object} studyData - Case study object from the builder
 * @param {string} studySchemaVersion - Numeric string for the case study file version from nuxt.config.js
 */
export function setMetaData (studyData, studySchemaVersion) {
  // Initialize meta key if not exists
  studyData.meta = studyData.meta || {}
  const nowDate = new Date()
  // Only set the date-created once upon study creation
  studyData.meta['date-created'] = studyData.meta['date-created'] ?? nowDate
  // Always update date-updated
  studyData.meta['date-updated'] = nowDate
  // Set UUID
  studyData.meta.uuid = studyData.meta.uuid ?? generateID()
  // Set case study file version
  studyData.meta.version = studySchemaVersion
  // Reset the reporter if is exercise
  // TODO is this needed?
  if (studyData.study['case-study-type'] === 'exercise') {
    studyData.study.reporter = ''
  }
  return studyData.meta
}
