import path from 'path'
import { dump } from 'js-yaml'
import { validate } from 'jsonschema'

import schema from '../static/atlas-data/dist/schemas/atlas_website_case_study_schema.json'

// Capitalizes the first letter of the provided string
export function capitalize (str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

export function generateID (template = 'xxxx-xxxx-xxxx') {
  // *NOT* RFC compliant, use this where the uniqueness isn't so important
  // adapted from stackoverflow
  return template.replace(/x/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Verifies if user uploaded case study yaml file is in correct format for use in case builder
export function validFormatYAML (yamlObj) {
  // Keeping date in ISO format for date format validation
  try {
    // i.e. 2022-01-01
    yamlObj.study['incident-date'] = yamlObj.study['incident-date'].toISOString().substring(0, 10)
  } catch (e) {
    // Error will be handled below
  }
  const validObj = validate(yamlObj, schema, { nestedErrors: true })
  // If yaml file format is valid
  if (validObj.valid) {
    return ''
  }
  // Else output error messages for user to correct formatting
  const errorList = validObj.errors
  const errorArrayLength = validObj.errors.length
  let errorMessages = 'File Errors: '
  const errorListSimplified = []
  // Iterates through error list to populate a new list that only contains user friendly (more readable) error messages
  for (let i = 0; i < errorArrayLength; i++) {
    if (!(errorList[i].stack).includes('subschema') && !(errorList[i].stack).includes('constant: null')) {
      errorListSimplified.push(errorList[i].stack)
    }
  }
  // Iterates through new curated error messages list to format their display
  for (let i = 0; i < errorListSimplified.length; i++) {
    errorMessages += errorListSimplified[i]
    if (i + 1 !== errorListSimplified.length) {
      errorMessages += ', '
    }
  }
  return errorMessages
}

export function download (filename, text) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function downloadStudyFile (study, filename) {
  const studyYAML = dump(study)
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
