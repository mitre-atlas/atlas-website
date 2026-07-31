/**
 * Helper functions for case study builder and display functionality.
 * @module tools
 */

import { dump } from 'js-yaml'
import jsyaml from 'js-yaml'
import { ATLAS_DATA_GITHUB_URL, NAVIGATOR_LAYER_URL, NAVIGATOR_URL } from '@/config/env'

import { caseStudySchema as schema } from './schemas.js'
import { EXTRA_ADDED_WEBSITE_KEYS } from '../stores/main'

const ATLAS_DATA_RELEASE_BASE_URL = `${ATLAS_DATA_GITHUB_URL}/releases/download`

/**
 * Capitalizes the first letter of the provided string.
 * @example
 * capitalize('hello world!') // Hello world!
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

/**
 * Splits text into array, capitalizes each word, joins into one string
 * @param {string} str
 * @param {string} splitter
 * @returns {string}
 */
export function capitalizeSidebar(str, splitter) {
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
export function lastWord(str) {
  const textArr = str.split(' ')
  return textArr[textArr.length - 1]
}

export function truncateText(value, max) {
  const text = String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
  if (typeof max === 'number' && text.length > max) {
    return text.slice(0, max) + '…'
  }
  return text
}

export function getFirstParagraph(text) {
  if (typeof text !== 'string') {
    return ''
  }

  return text.trim().split(/\n\n+/)[0]?.trim() || ''
}

export function getReferenceDisplayText(reference, max) {
  const text = reference?.title?.trim() || reference?.url?.trim() || 'Untitled reference'
  return truncateText(text, max)
}

function normalizeReferenceId(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Converts custom inline citations in the form [[reference-id]] into numbered markdown links
 * and returns cited references in first-use order.
 *
 * Supports fallback numeric IDs, ex. [[1]] maps to references[0].
 *
 * @param {string} description
 * @param {Array<{id?: string, title?: string, url?: string}>} references
 * @returns {{ description: string, citedReferences: object[], orderedReferences: object[], missingReferenceIds: string[] }}
 */
export function resolveDescriptionCitations(description, references = []) {
  const text = typeof description === 'string' ? description : ''
  const refs = Array.isArray(references) ? references : []

  const refsById = new Map()
  refs.forEach((reference, index) => {
    const normalizedId = normalizeReferenceId(reference?.id)
    if (normalizedId && !refsById.has(normalizedId)) {
      refsById.set(normalizedId, { reference, index })
    }
  })

  const citationNumberByReferenceIndex = new Map()
  const citedReferences = []
  const missingReferenceIds = new Set()

  const output = text.replace(/\[\[([^\]]+)\]\]/g, (match, rawId) => {
    const tokenId = normalizeReferenceId(rawId)
    let resolved = refsById.get(tokenId)

    if (!resolved && /^\d+$/.test(tokenId)) {
      const index = Number(tokenId) - 1
      if (index >= 0 && index < refs.length) {
        resolved = { reference: refs[index], index }
      }
    }

    if (!resolved) {
      missingReferenceIds.add(String(rawId).trim())
      return match
    }

    const refIndex = resolved.index
    const reference = resolved.reference
    if (!citationNumberByReferenceIndex.has(refIndex)) {
      citationNumberByReferenceIndex.set(refIndex, citedReferences.length + 1)
      citedReferences.push(reference)
    }

    const citationNumber = citationNumberByReferenceIndex.get(refIndex)
    const url = typeof reference?.url === 'string' ? reference.url.trim() : ''

    if (!url) {
      return `<sup>[${citationNumber}]</sup>`
    }

    const escapedUrl = escapeHtml(url)
    return `<sup><a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">[${citationNumber}]</a></sup>`
  })

  const citedReferenceIndexes = new Set(citationNumberByReferenceIndex.keys())
  const uncitedReferences = refs.filter((_, index) => !citedReferenceIndexes.has(index))
  const orderedReferences = citedReferences.concat(uncitedReferences)

  return {
    description: output,
    citedReferences,
    orderedReferences,
    missingReferenceIds: Array.from(missingReferenceIds),
  }
}

export function collectUniqueArrayValues(objs, key) {
  const set = new Set()
  objs.forEach((obj) => {
    const val = obj?.[key]
    if (Array.isArray(val)) {
      val.forEach((value) => {
        if (typeof value === 'string' && value.trim()) {
          set.add(value)
        }
      })
    } else if (typeof val === 'string' && val.trim()) {
      set.add(val)
    }
  })
  return Array.from(set).sort()
}

/**
 * Generates a 12-digit UUID-like string for case study file metadata use,
 * to uniquely identify each downloaded file.
 * @example
 * generateID() // 'fcac-f4ba-d65b'
 * @param {string} [template='xxxx-xxxx-xxxx]
 * @returns {string}
 */
export function generateID(template = 'xxxx-xxxx-xxxx') {
  // *NOT* RFC compliant, use this where the uniqueness isn't so important
  // adapted from stackoverflow
  return template.replace(/x/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Verifies if user uploaded case study yaml file is up to date schema version
 * @param {object} yamlObj - Object read from uploaded case study YAML file
 * @returns {boolean}
 */
export function isSchemaOutdated(yamlObj) {
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
export function formatCaseStudyIncidentDate(caseStudy) {
  const date = caseStudy.date
  const dateGranularity = caseStudy['date-granularity']

  if (!date) {
    return ''
  }

  if (date instanceof Date) {
    const dateOptions =
      dateGranularity === 'Year'
        ? { timeZone: 'UTC', year: 'numeric' }
        : dateGranularity === 'Month'
          ? { timeZone: 'UTC', year: 'numeric', month: 'long' }
          : { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('default', dateOptions)
  }

  const rawDate = String(date)

  if (dateGranularity === 'Year') {
    return rawDate.slice(0, 4)
  }

  const parts = rawDate.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1] || 1)
  const day = Number(parts[2] || 1)

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return rawDate
  }

  const parsedDate = new Date(Date.UTC(year, month - 1, day))

  if (Number.isNaN(parsedDate.getTime())) {
    return rawDate
  }

  const dateOptions =
    dateGranularity === 'Month'
      ? { timeZone: 'UTC', year: 'numeric', month: 'long' }
      : { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }

  return parsedDate.toLocaleDateString('default', dateOptions)
}

/**
 * Allows the browser to download the provided text to the provided filename.
 * @param {string} filename - Filename including extension
 * @param {object} text - Object representing file contents
 */
export function download(filename, text) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(text))
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
export function downloadStudyFile(study, filename) {
  const studyCopy = JSON.parse(JSON.stringify(study))
  EXTRA_ADDED_WEBSITE_KEYS.forEach((key) => delete studyCopy.study[key])
  const studyYAML = dump(studyCopy, { replacer: trimStrings }).replace('T00:00:00.000Z', '')
  download(`${filename}.yaml`, studyYAML)
}

/**
 * Allows the browser to download a remote file specified by URL.
 * For use serving files on GitHub.
 * @param {string} url
 */
export function downloadUrlAsFile(url, downloadName) {
  // Downloads a file located at url
  // Parameter url is a string
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = function () {
    let a = document.createElement('a')
    a.href = window.URL.createObjectURL(xhr.response) // xhr.response is a blob
    const urlSegments = url.split('/')
    const basename = urlSegments[urlSegments.length - 1]
    a.download = downloadName || basename
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
export function openNewTab(url) {
  window.open(url, '_blank')
}

/**
 * Constructs the link to a Navigator layer bundled with the standalone app.
 *
 * @param {string} filename JSON filename, without the extension
 */
export function constructNavigatorLayerUrl(filename) {
  return new URL(`${filename}.json`, new URL(NAVIGATOR_LAYER_URL, window.location.origin)).href
}

/**
 * Constructs the link to open the specified Navigator layer file
 * in the ATLAS Navigator.
 * @param {string} layerUrl
 */
export function constructNavigatorUrlToLayer(layerUrl) {
  const navigatorUrl = new URL(NAVIGATOR_URL, window.location.origin).href
  return `${navigatorUrl}#layerURL=${encodeURIComponent(layerUrl)}`
}

export function constructReleaseArtifactUrl(filename, version) {
  const normalizedVersion = String(version || '').trim()
  const normalizedFilename = String(filename || '').trim()
  if (!normalizedVersion || !normalizedFilename) {
    return ''
  }
  return `${ATLAS_DATA_RELEASE_BASE_URL}/v${encodeURIComponent(normalizedVersion)}/${normalizedFilename}`
}

/**
 * Prepends the .env-provided base URL to the provided path.
 * For use by `fetch()`
 * @param {string} pathString
 */
export function getPathWithBase(pathString) {
  const base = String(import.meta.env.BASE_URL || '/')
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = String(pathString || '').replace(/^\/+/, '')
  return `${normalizedBase}${normalizedPath}`
}

/**
 * Get the string with the numeric month and year of the latest update.
 *
 * Ex. .../update-files/2024-01.md > 2024-01
 */
export function getLatestUpdateDate() {
  const modules = import.meta.glob('@/../public/content/update-files/*.md')
  const updateFilepaths = Object.keys(modules).sort((a, b) => a.localeCompare(b))
  // Filepaths are named with numeric YEAR-MONTH.md, so the last one is the most recent
  const latestFilepath = updateFilepaths.pop()

  // Return the YEAR-MONTH portion of the filepath
  const startIndex = latestFilepath.lastIndexOf('/') + 1
  const endIndex = latestFilepath.lastIndexOf('.md')
  const date = latestFilepath.substring(startIndex, endIndex)

  return date
}

/**
 * Get tooltip descriptions for IDView tags and Table filters
 */
export async function getDescriptions() {
  try {
    const categoriesResponse = await fetch(getPathWithBase('/content/descriptions/categories.yaml'))
    const categories = await categoriesResponse.text()
    let output = jsyaml.load(categories).categories

    const lifecycleResponse = await fetch(
      getPathWithBase('/content/descriptions/ML-lifecycle.yaml')
    )
    const lifecycles = await lifecycleResponse.text()
    output = output.concat(jsyaml.load(lifecycles)['ML-lifecycle'])
    return output
  } catch (error) {
    console.error('Error fetching YAML file:', error)
  }
}

/**
 * Check if a string is a valid URL
 *
 * Returns true when valid, or a string error message when invalid.
 * @param {(string|null|undefined)} value
 * @returns {(true|string)}
 */
export function validateUrl(value) {
  if (!value) return true

  const v = value.trim()
  if (!v) return true

  if (/\s/.test(v)) return 'URL must not contain spaces'

  const hasProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(v)

  try {
    const url = new URL(hasProtocol ? v : `https://${v}`)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'URL protocol must be http(s):// when provided'
    }
    if (!isHostWithTopLevelDomain(url.hostname)) return 'Invalid URL format'

    return true
  } catch {
    return 'URL is not valid'
  }
}

function isHostWithTopLevelDomain(host) {
  const parts = host.split('.')
  if (parts.length < 2) return false

  const partsAreValid = parts.every((label) => {
    return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)
  })
  const topLevelDomain = parts[parts.length - 1]

  return partsAreValid && /^[a-z]{2,}$/i.test(topLevelDomain)
}

/**
 * Convenience boolean predicate built on validateUrl.
 * @param {(string|null|undefined)} value
 * @returns {boolean}
 */
export function isUrlValid(value) {
  return validateUrl(value) === true
}
