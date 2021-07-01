import * as YAML from 'js-yaml'

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
}

export { createJSON, createYAML, download, deepCopy, dateToString, generateID, yamlParse, downloadStudyFile }
