import path from 'path'
import { dump } from 'js-yaml'
import { validate } from 'jsonschema'

import schema from '../static/atlas-data/dist/schemas/atlas_website_case_study_schema.json'
import { EXTRA_ADDED_WEBSITE_KEYS } from '../store/index.js'

// Capitalizes the first letter of the provided string
export function capitalize (str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

export function generateID (template = 'xxxx-xxxx-xxxx') {
  // *NOT* RFC compliant, use this where the uniqueness isn't so important
  // adapted from stackoverflow
  return template.replace(/x/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const depArray = []
function preValidateProperty (object, key, schema, options, ctx) {
  if (schema.deprecated && key in object) {
    depArray.push('Deprecation Error: ' + schema.depMessage)
  }
}

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

// Verifies if user uploaded case study yaml file is in correct format for use in case builder
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

// Verifies if user uploaded case study yaml file is up to date schema version
export function isSchemaOutdated (yamlObj) {
  return yamlObj.meta.version !== schema.$version
}

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

// Helper function for downloadStudyFile function
const trimStrings = function (key, value) {
  if (typeof value === 'string') {
    return value.trim()
  }
  return value
}

export function downloadStudyFile (study, filename) {
  const studyCopy = Object.assign({}, study)
  EXTRA_ADDED_WEBSITE_KEYS.forEach(key => delete studyCopy.study[key])
  const studyYAML = dump(studyCopy, { replacer: trimStrings }).replace(
    'T00:00:00.000Z',
    ''
  )
  download(`${filename}.yaml`, studyYAML)
}

export function downloadUrlAsFile (url) {
  // Downloads a file located at url
  // Parameter url is a string
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = function () {
    let a = document.createElement('a')
    a.href = window.URL.createObjectURL(xhr.response) // xhr.response is a blob
    a.download = path.basename(url) // Set download filename to url filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a = null
  }
  xhr.open('GET', url)
  xhr.send()
}

export function openNewTab (url) {
  window.open(url, '_blank')
}

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
}
