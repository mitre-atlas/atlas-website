import * as YAML from 'js-yaml'

const sentenceRegex = /([.!?]) \b(?=[A-Z]|\d)/g
const reportedByDelim = ','
const TAB_LENGTH = 2

function sentenceNewline (text, escape = false) {
  return text.replaceAll(sentenceRegex, '$1' + (!escape ? '\n' : '\\n')) // + '\n'
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
function generateID (name) {
  return `AML.CS${pad(name.length, 5)}`
}

function deepCopy (object) {
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
    return value.trim() + '\n'
  } else {
    return value
  }
}

const createYAML = o => YAML.dump(o, { replacer: reviver })
const yamlParse = t => YAML.load(t)

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

export { createJSON, createYAML, download, deepCopy, yamlParse }
