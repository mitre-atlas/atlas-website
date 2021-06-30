const getScope = key => scopeDictionary[key]
// const sentenceRegex = /(?<=[.!?]) \b(?=[A-Z]|[0-9])/g
const sentenceRegex = /([.!?]) \b(?=[A-Z]|\d)/g
const reportedByDelim = ','
const TAB_LENGTH = 2
const scopeDictionary = {
  id: 0,
  name: 1,
  objectType: 1,
  summary: 2,
  incidentDate: 1,
  procedure: 1,
  tactic: 2,
  technique: 3,
  stepDescription: 4,
  reportedBy: 2,
  references: 2
}

function sentenceNewline (text, escape = false) {
  return text.replaceAll(sentenceRegex, '$1' + (!escape ? '\n' : '\\n')) + '\n'
}

function sentenceSplit (text, removeNewlines) {
  if (removeNewlines) {
    text = text.replaceAll('\n', ' ')
  }
  const split = text.split(sentenceRegex).map((e, i, a) => { // element, index, array
    if ('?!.'.split('').includes(e)) {
      return null
    } else if (i + 1 === a.length) {
      return e
    } else {
      return e + a[i + 1]
    }
  }).filter(e => e)
  return split
}

// function sentenceNewline (text, escape = false) {
//   return text.replaceAll(sentenceRegex, '$&'[0] + !escape ? '\n' : '\\n') + '\n'
// }

// function sentenceSplit (text, removeNewlines) {
//   if (removeNewlines) { text = text.replaceAll('\n', ' ') }
//   return text.split(sentenceRegex)
// }

function pad (value, max, padChar = '0') {
  return String(value).padStart(max, padChar)
}

// still need to figure out what this will be
function getCaseStudyID (name) {
  return `AML.CS${pad(name.length, 5)}`
}

function flattenReferences (refArray) {
  const outArray = []

  if (refArray.length === 0) {
    return null
  }

  for (const index in refArray) {
    const sourceObj = refArray[index]
    const flat = `${sourceObj.sourceDescription}` + (sourceObj.url ? ` (${sourceObj.url})` : '')
    // const flat = `${sourceObj.source}` + (sourceObj.sourceLink ? ` (${sourceObj.sourceLink})` : '')
    outArray[index] = flat
  }
  return outArray
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
  // expensive, not recommened for large objects
  // can't include functions, symbols, undefined, circular references
  // infinity, NaN will be turned to null
  // dates -> string
  try {
    return JSON.parse(JSON.stringify(object))
  } catch (e) {
    console.log('Can\'t deepcopy invalid object')
  }
}

function dateToString (dateObj) {
  const date = +pad(dateObj.getDate() + 1, 2)
  const month = +pad(dateObj.getMonth() + 1, 2)
  const year = dateObj.getFullYear()

  return `${year}-${month}-${date}`
}

function procedureFormat (procedureArray) {
  const outArray = []
  for (const i in procedureArray) {
    const step = { ...procedureArray[i] }
    step.description = sentenceNewline(step.description)
    outArray[i] = step
  }
  return outArray
}

function appendLine (text, scope = 0) {
  this.text += (' '.repeat(scope * TAB_LENGTH)) + text + '\n'
}

function reviver (key, value) {
  if (key === 'reported-by') {
    // console.log(value)
    // console.log('type is ', typeof value)
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
    return value + '\n'
  } else {
    return value
  }
}

function createYAML (obj) { // probably broken
  const yaml = { text: '', appendLine }
  const procedure = obj.procedure
  const reportedBy = obj['reported-by'][0].split(reportedByDelim).map(e => e.trim())
  const references = flattenReferences(obj.references)
  // const references = referenceFormat(obj.references)

  function appendArray (array, scopeName, omitDash) {
    for (const value of array) {
      yaml.appendLine((omitDash ? '' : '- ') + value, getScope(scopeName))
    }
  }

  yaml.appendLine(`- id: ${getCaseStudyID(obj.name)}`, getScope('id'))
  yaml.appendLine(`name: ${obj.name}`, getScope('name'))
  yaml.appendLine('object-type: case-study', getScope('objectType'))
  yaml.appendLine('summary: |', getScope('summary') - 1)
  yaml.appendLine(obj.summary.slice(0, -2), getScope('summary')) // slice removes newline
  // yaml.appendLine(`incident-date: ${dateToString(obj['incident-date'])}`, getScope('incidentDate'))
  yaml.appendLine(`incident-date: ${obj['incident-date']}`, getScope('incidentDate'))
  yaml.appendLine('procedure:', getScope('procedure'))

  for (const step of procedure) {
    // const step = procedure[i]
    const tacticID = step.tactic
    const techniqueID = step.technique
    const description = step.description

    yaml.appendLine(`- tactic: ${tacticID}`, getScope('tactic'))
    yaml.appendLine(`technique: ${techniqueID}`, getScope('technique'))
    yaml.appendLine('description: |', getScope('stepDescription') - 1)
    appendArray(sentenceSplit(description, true), 'stepDescription', true)
  }

  yaml.appendLine('reported-by:', getScope('reportedBy') - 1)
  appendArray(reportedBy, 'reportedBy')

  yaml.appendLine('references:', getScope('references') - 1)
  appendArray(references, 'references')

  return yaml.text
}

function createJSON (obj) {
  obj['object-type'] = 'case-study'
  obj.id = getCaseStudyID(obj.name)
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


export { createJSON, createYAML, download, deepCopy, generateID }