import path from 'path'
import { dump } from 'js-yaml'
import { validate } from 'jsonschema'

import schema from '../public/atlas-data/dist/schemas/atlas_website_case_study_schema.json'

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

// Helper function for downloadStudyFile function
const trimStrings = function (key, value) {
  if (typeof value === 'string') {
    return value.trim()
  }
  return value
}


export function downloadStudyFile (study, filename) {
  const studyYAML = dump(study, { replacer: trimStrings }).replace('T00:00:00.000Z', '')
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
