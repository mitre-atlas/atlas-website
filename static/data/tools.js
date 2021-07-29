import * as YAML from 'js-yaml'
// import { makePPT } from 'static/data/ppt.js'

const sentenceRegex = /([.!?]) \b(?=[A-Z]|\d)/g
const reportedByDelim = ','
const TAB_LENGTH = 2

const timezoneOptions = { timeZone: 'UTC', timeZoneName: 'short' }

function sentenceNewline (text, escape = false) {
  return text.replaceAll(sentenceRegex, '$1' + (!escape ? '\n' : '\\n')) + (text.endsWith('\n') ? '' : '\n')
}

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

// still need to figure out what this will be
function getCaseStudyID (name) {
  return `AML.CS${pad(name.length, 5)}`
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
// }

function deepCopy (object) {
  try {
    return JSON.parse(JSON.stringify(object))
  } catch (e) {
    return null
    // console.log('Can\'t deepcopy invalid object')
  }
}

function dateToString (dateObj, includeTime = false) {
  const date = +pad(dateObj.getDate(), 2)
  const month = +pad(dateObj.getMonth() + 1, 2)
  const year = dateObj.getFullYear()

  return (`${year}-${month}-${date}`) + (includeTime ? ' ' + dateObj.toLocaleTimeString([], timezoneOptions) : '')
}

function procedureFormat (procedureArray) {
  const outArray = []
  for (const i in procedureArray) {
    const step = { ...procedureArray[i] }
    step.description = sentenceNewline(step.description.trim()) + '\n'
    outArray[i] = step
  }
  return outArray
}

function reviver (key, value) {
  if (key === 'reported-by') {
    if (typeof value === 'string') {
      return value.split(reportedByDelim).map(e => e.trim())
    } else if (typeof value === 'object') {
      return value[0].split(reportedByDelim).map(e => e.trim())
    }
  } else if (key === 'incident-date') {
    return dateToString(new Date(value))
  } else if (key === 'procedure') {
    return procedureFormat(value)
  } else if (key === 'summary') {
    return value + (value.endsWith('\n') ? '' : '\n')
  } else {
    return value
  }
}

const createYAML = o => YAML.dump(o, { replacer: reviver })
const yamlParse = t => YAML.load(t)

function validFormatYAML (yamlObj) {
  const required = {
    email: false,
    'incident-date': false,
    name: false,
    'reported-by': false,
    summary: false,
    procedure: false,
    description: false,
    tactic: false,
    technique: false
  }
  const notRequired = ['date-created', 'date-updated', 'uuid', 'references', 'sourceDescription', 'url']
  if (!(yamlObj.meta && yamlObj.study)) { return 'YAML is missing meta or study data' }
  // check meta data
  for (const metaKey in yamlObj.meta) {
    if (metaKey in required) {
      required[metaKey] = true
    } else if (!notRequired.includes(metaKey)) { return 'Meta data contains invalid key' }
  }
  // check study data
  for (const studyKey in yamlObj.study) {
    if (studyKey in required) {
      required[studyKey] = true
      // make sure each procedure step is correctly formatted
      if (studyKey === 'procedure') {
        const procObj = yamlObj.study[studyKey]
        if (procObj === null) { return 'YAML file requires at least one procedure step' }
        for (let i = 0; i < procObj.length; i++) {
          if ('tactic' in procObj[i] && 'technique' in procObj[i] && 'description' in procObj[i] && Object.keys(procObj[i]).length === 3) {
            required.description = true
            required.technique = true
            required.tactic = true
          } else { return 'Each procedure step requires tactic, technique, and description' }
        }
      }
    } else if (notRequired.includes(studyKey)) {
      // ensure references are correctly formatted
      if (studyKey === 'references') {
        const refObj = yamlObj.study[studyKey]
        if (refObj === null) { return 'If study has references, include sourceDescription and/or url' }
        for (let i = 0; i < refObj.length; i++) {
          if (!('sourceDescription' in refObj[i] || 'url' in refObj[i])) { return 'Each reference requires sourceDescription and/or url' }
        }
      }
    } else { return 'Study data contains invalid key' }
  }
  // return whether all required fields are true
  if (Object.keys(required).every(k => required[k])) {
    return ''
  } else { return 'YAML file is missing required values' }
}

function createJSON (obj) {
  obj.study['object-type'] = 'case-study'
  obj.study.id = getCaseStudyID(obj.name)
  const json = JSON.stringify(obj, reviver, TAB_LENGTH)
  return json
}

function download (filename, text) { // ripped from stackoverflow lets gooooooooo
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function downloadStudyFile (study) {
  const studyBody = study.study
  const studyYAML = createYAML(study)
  download(`${studyBody.name}-YAML.yaml`, studyYAML)
  // makePPT(study)
}

export { createJSON, createYAML, download, deepCopy, dateToString, generateID, yamlParse, validFormatYAML, downloadStudyFile }
