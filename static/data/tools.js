import * as YAML from 'js-yaml'
import { validate } from 'jsonschema'
// import schema from '@/static/data/case-study-schema.json'
import schema from '@/static/data/cs_schema.json'
const path = require('path')

const timezoneOptions = { timeZone: 'UTC', timeZoneName: 'short' }

// function sentenceSplit (text, removeNewlines) {
//   if (removeNewlines) {
//     text = text.replaceAll('\n', ' ')
//   }
//   const split = text.split(sentenceRegex).map((e, i, a) => { // element, index, array
//     if ('?!.'.split('').includes(e)) {
//       return null
//     } else if (i + 1 === a.length) {
//       return e
//     } else {
//       return e + a[i + 1]
//     }
//   }).filter(e => e)
//   return split
// }

function pad (value, max, padChar = '0') {
  return String(value).padStart(max, padChar)
}

// function flattenReferences (refArray) {
//   const outArray = []

//   if (refArray.length === 0) {
//     return null
//   }

//   for (const index in refArray) {
//     const sourceObj = refArray[index]
//     const flat = `${sourceObj.sourceDescription}` + (sourceObj.url ? ` (${sourceObj.url})` : '')
//     // const flat = `${sourceObj.source}` + (sourceObj.sourceLink ? ` (${sourceObj.sourceLink})` : '')
//     outArray[index] = flat
//   }
//   return outArray
// }

// function referenceFormat (refArray) {
//   console.log(refArray)
//   const outArray = []
//   for (const index in refArray) {
//     const sourceObject = refArray[index]
//     outArray[index] = {
//       sourceDescription: sourceObject.source,
//       url: sourceObject.sourceLink
//     }
//   }
//   return outArray
// }

function generateID (template = 'xxxx-xxxx-xxxx') {
  // *NOT* RFC compliant, use this where the uniqueness isn't so important
  // adapted from stackoverflow
  return template.replace(/x/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function dateToString (dateObj, includeTime = false) {
  const date = +pad(dateObj.getDate(), 2)
  const month = +pad(dateObj.getMonth() + 1, 2)
  const year = dateObj.getFullYear()

  return (`${year}-${month}-${date}`) + (includeTime ? ' ' + dateObj.toLocaleTimeString([], timezoneOptions) : '')
}

const createYAML = o => YAML.dump(o)
const yamlParse = t => YAML.load(t)

// Verifies if user uploaded case study yaml file is in correct format for use in case builder
function validFormatYAML (yamlObj) {
  const yamlStudyData = yamlObj.study
  // Keeping date in ISO format for date-time format validation
  try {
    yamlStudyData['incident-date'] = yamlStudyData['incident-date'].toISOString()
  } catch (e) {
    if (e instanceof TypeError) {
      return 'instance.incident-date is not of a type(s) date-time'
    }
  }
  const validObj = validate(yamlStudyData, schema, { nestedErrors: true })
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

// function validFormatYAML (yamlObj) {
//   const required = {
//     'incident-date': false,
//     name: false,
//     'reported-by': false,
//     summary: false,
//     procedure: false,
//     description: false,
//     tactic: false,
//     technique: false
//   }
//   const notRequired = ['date-created', 'date-updated', 'uuid', 'references', 'title', 'url', 'incident-date-granularity']
//   if (!(yamlObj.meta && yamlObj.study)) { return 'YAML is missing meta or study data' }
//   // check meta data
//   for (const metaKey in yamlObj.meta) {
//     if (metaKey in required) {
//       required[metaKey] = true
//     } else if (!notRequired.includes(metaKey)) { return 'Meta data contains invalid key' }
//   }
//   // check study data
//   for (const studyKey in yamlObj.study) {
//     if (studyKey in required) {
//       required[studyKey] = true
//       // make sure each procedure step is correctly formatted
//       if (studyKey === 'procedure') {
//         const procObj = yamlObj.study[studyKey]
//         if (procObj === null) { return 'YAML file requires at least one procedure step' }
//         for (let i = 0; i < procObj.length; i++) {
//           if ('tactic' in procObj[i] && 'technique' in procObj[i] && 'description' in procObj[i] && Object.keys(procObj[i]).length === 3) {
//             required.description = true
//             required.technique = true
//             required.tactic = true
//           } else { return 'Each procedure step requires tactic, technique, and description' }
//         }
//       }
//     } else if (notRequired.includes(studyKey)) {
//       // ensure references are correctly formatted
//       if (studyKey === 'references') {
//         const refObj = yamlObj.study[studyKey]
//         if (refObj === null) { return 'If study has references, include title and/or url' }
//         for (let i = 0; i < refObj.length; i++) {
//           if (!('title' in refObj[i] || 'url' in refObj[i])) { return 'Each reference requires title and/or url' }
//         }
//       }
//     } else { return 'Study data contains invalid key' }
//   }
//   // return whether all required fields are true
//   if (Object.keys(required).every(k => required[k])) {
//     return ''
//   } else { return 'YAML file is missing required values' }
// }

function download (filename, text) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function downloadStudyFile (study, filename) {
  console.log(study)
  const studyYAML = createYAML(study)
  download(`${filename}.yaml`, studyYAML)
}

function downloadUrlAsFile (url) {
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

export { createYAML, download, downloadUrlAsFile, dateToString, generateID, yamlParse, validFormatYAML, downloadStudyFile }
