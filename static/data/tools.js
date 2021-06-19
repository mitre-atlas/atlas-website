const getScope = key => scopeDictionary[key]
const sentenceRegex = /(?<=[.!?]) \b(?=[A-Z]|[0-9])/g
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
  return text.replaceAll(sentenceRegex, !escape ? '\n' : '\\n') + '\n'
}

function sentenceSplit (text, removeNewlines) {
  if (removeNewlines) { text = text.replaceAll('\n', ' ') }
  return text.split(sentenceRegex)
}

function pad (value, max, padChar = '0') {
  return String(value).padStart(max, padChar)
}

// still need to figure out what this will be
function generateID (name) {
  return `AML.CS${pad(name.length, 5)}`
}

function flattenReferences (refArray) {
  const outArray = []

  if (refArray.length === 0) {
    return null
  }

  for (const index in refArray) {
    const sourceObj = refArray[index]
    const flat = `${sourceObj.source}` + (sourceObj.sourceLink ? ` (${sourceObj.sourceLink})` : '')
    outArray[index] = flat
  }
  return outArray
}

function dateToString (dateObj) {
  const date = pad(dateObj.getDate(), 2) + 1
  const month = pad(dateObj.getMonth(), 2) + 1
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
    return value.split(reportedByDelim + ' ')
  } else if (key === 'references') {
    return flattenReferences(value)
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

function createYAML (obj) {
  const yaml = { text: '', appendLine }
  const procedure = obj.procedure
  const reportedBy = obj['reported-by'].split(reportedByDelim + ' ')
  const references = flattenReferences(obj.references)

  function appendArray (array, scopeName, omitDash) {
    for (const value of array) {
      yaml.appendLine((omitDash ? '' : '- ') + value, getScope(scopeName))
    }
  }

  yaml.appendLine(`- id: ${generateID(obj.name)}`, getScope('id'))
  yaml.appendLine(`name: ${obj.name}`, getScope('name'))
  yaml.appendLine('object-type: case-study', getScope('objectType'))
  yaml.appendLine('summary: |', getScope('summary') - 1)
  yaml.appendLine(obj.summary, getScope('summary'))
  yaml.appendLine(`incident-date: ${dateToString(obj['incident-date'])}`, getScope('incidentDate'))
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
  obj.id = generateID(obj.name)
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

export { createJSON, createYAML, download }
