/**
 * Contribution form utilities: schema import, validation, draft mapping, YAML download
 */
import { validate } from 'jsonschema'
import { dump } from 'js-yaml'
import { contributionSchema as schema } from './schemas.js'

const typeInfo = {
  tactics: {
    title: 'Tactic',
    pluralTitle: 'Tactics',
    objectType: 'tactic',
    definitionKey: 'tactic',
  },
  techniques: {
    title: 'Technique',
    pluralTitle: 'Techniques',
    objectType: 'technique',
    definitionKey: 'technique',
  },
  mitigations: {
    title: 'Mitigation',
    pluralTitle: 'Mitigations',
    objectType: 'mitigation',
    definitionKey: 'mitigation',
  },
  studies: {
    title: 'Case Study',
    pluralTitle: 'Case Studies',
    objectType: 'case-study',
    definitionKey: 'case_study',
  },
  other: {
    title: 'General Contribution',
    pluralTitle: 'General Contributions',
    objectType: 'other',
    definitionKey: 'other',
  },
}

const typeOptions = Object.entries(typeInfo).map(([value, { title }]) => ({
  value,
  title,
}))

const matrixTypeOptions = typeOptions.filter(({ value }) => value !== 'other')

const matrixAssociations = {
  tactics: ['techniques'],
  techniques: ['tactics', 'mitigations'],
  mitigations: ['techniques'],
}

export function getResponsibleDisclosureConsideration(typeWordLower) {
  return `Ensure you have permission to share this information and/or publish this research. Please follow the proper channels for your organization before reporting a new ${typeWordLower} and make sure you are practicing responsible disclosure.`
}

export const caseStudyConsiderations = [
  'Case Studies are intended for attacks that exploit one or more vulnerabilities compromising the confidentiality, integrity or availability of an Artificial Intelligence (AI) system.',
  'The attack is against a production / commercial AI system. The attack can be on AIaaS or AI systems embedded in clients / at the edge or conducted through red team exercises.',
]

const typeToObject = Object.fromEntries(
  Object.entries(typeInfo).map(([typeKey, { objectType }]) => [typeKey, objectType])
)

const objectToType = Object.fromEntries(
  Object.entries(typeInfo).map(([typeKey, { objectType }]) => [objectType, typeKey])
)

const objectToDef = Object.fromEntries(
  Object.values(typeInfo).map(({ objectType, definitionKey }) => [objectType, definitionKey])
)

/**
 * Returns Vuetify-ready contribution type select options.
 *
 * @param {boolean} includeOther Include the non-matrix "General Contribution" type.
 * @returns {{ value: string, title: string }[]}
 */
export function getContributionTypeOptions(includeOther = true) {
  return includeOther ? [...typeOptions] : [...matrixTypeOptions]
}

export function isContributionTypeKey(typeKey) {
  return Object.prototype.hasOwnProperty.call(typeInfo, typeKey)
}

export function getMatrixAssociations(typeKey = '') {
  return [...(matrixAssociations[typeKey] ?? [])]
}

/**
 * Formats a contribution type key for display.
 *
 * @param {string} typeKey Form type key such as "techniques" or "studies".
 * @param {boolean} lowercase Return a lower-case label.
 * @param {boolean} plural Return the plural label.
 * @returns {string}
 */
export function contributionTypeWordFromKey(typeKey = '', lowercase = false, plural = false) {
  let label = typeInfo[typeKey]?.title

  if (plural) {
    label = typeInfo[typeKey]?.pluralTitle
  }

  if (lowercase) {
    return (label ?? '').toLowerCase()
  }

  return label ?? ''
}

export function contributionObjectTypeFromKey(typeKey = '') {
  return typeToObject[typeKey] ?? ''
}

function getPath(source, path = []) {
  return path.reduce((current, key) => current?.[key], source)
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function trim(value) {
  return typeof value === 'string' ? value.trim() : value
}

/**
 * Recursively trims strings in form drafts before schema mapping or validation.
 *
 * @param {*} value Any draft value.
 * @returns {*} The value with string leaves trimmed.
 */
export function trimStringValues(value) {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.map(trimStringValues)

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, trimStringValues(entryValue)])
    )
  }

  return value
}

function cleanRef(reference = {}) {
  return {
    title: trim(reference?.title ?? ''),
    url: trim(reference?.url ?? reference?.referenceLink ?? ''),
  }
}

function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0
  return value === undefined || value === null || value === ''
}

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isDraftItem(value) {
  return isObject(value) && value.id === 'new'
}

function matrixAssociationErrors(contributionObj) {
  const payload = wrapPayload(contributionObj)
  const errors = []
  const associationKeys = Object.keys(matrixAssociations)

  for (const submission of ensureArray(payload?.submissions)) {
    if (!isObject(submission) || isObject(submission.study)) continue

    const typeKey = objectToType[submission?.['object-type']]
    const allowedKeys = matrixAssociations[typeKey]
    if (!allowedKeys) continue

    const invalidKeys = associationKeys.filter(
      (key) => !allowedKeys.includes(key) && key in submission
    )
    if (!invalidKeys.length) continue

    const typeWord = contributionTypeWordFromKey(typeKey)
    const allowedLabels = allowedKeys.map((key) => contributionTypeWordFromKey(key, true, true))
    const invalidLabels = invalidKeys.map((key) => contributionTypeWordFromKey(key, true, true))

    errors.push(
      `${typeWord} submissions can only associate ${allowedLabels.join(' and ')}. Remove associated ${invalidLabels.join(' and ')} from the uploaded file.`
    )
  }

  return errors
}

function setPath(target, path, value) {
  if (!Array.isArray(path) || !path.length) return
  let current = target
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index]
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  current[path[path.length - 1]] = value
}

function mapRefs(references = []) {
  return ensureArray(references).map((reference) => {
    const sanitized = cleanRef(reference)
    return {
      title: sanitized.title,
      url: sanitized.url,
    }
  })
}

function mapDraftItemToReference(draftItem = {}) {
  if (
    isEmpty(draftItem?.referenceDescription) &&
    isEmpty(draftItem?.referenceLink)
  ) {
    return []
  }

  return [
    {
      title: draftItem?.referenceDescription ?? '',
      url: draftItem?.referenceLink ?? '',
    },
  ]
}

function mapDraftItemToInlineObject(draftItem, typeKey) {
  const sanitizedDraftItem = trimStringValues(draftItem)
  const references = mapDraftItemToReference(sanitizedDraftItem)
  const submission = {
    'object-type': typeToObject[typeKey],
    name: sanitizedDraftItem?.name ?? '',
    description: sanitizedDraftItem?.summary ?? '',
  }

  if (references.length) {
    submission.references = references
  }

  return submission
}

function mapProcedureValueToSubmission(value, typeKey) {
  if (isDraftItem(value)) return mapDraftItemToInlineObject(value, typeKey)
  return value ?? null
}

function mapProcedures(procedures = []) {
  return ensureArray(procedures).map((procedure) => ({
    tactic: mapProcedureValueToSubmission(procedure?.tactic, 'tactics'),
    technique: mapProcedureValueToSubmission(procedure?.technique, 'techniques'),
    description: trim(procedure?.description ?? ''),
  }))
}

function mapInlineObjectToDraftItem(value) {
  if (!isObject(value)) return value ?? null

  const reference = ensureArray(value?.references)[0] ?? {}
  const draftItem = {
    id: 'new',
    name: value?.name ?? '',
    summary: value?.description ?? value?.summary ?? '',
    referenceDescription: reference?.title ?? '',
    referenceLink: reference?.url ?? '',
  }
  if ('use' in value) draftItem.use = value.use ?? ''
  return draftItem
}

function mapProceduresToDraft(procedures = []) {
  return ensureArray(procedures).map((procedure) => ({
    tactic: mapInlineObjectToDraftItem(procedure?.tactic),
    technique: mapInlineObjectToDraftItem(procedure?.technique),
    description: trim(procedure?.description ?? ''),
  }))
}

function associationValueId(value) {
  if (typeof value === 'string') return value
  if (isObject(value) && typeof value.id === 'string') return value.id
  return null
}

function mapAssociationIds(values = []) {
  return ensureArray(values).map(associationValueId).filter(Boolean)
}

function mapAssociationToDraft(value) {
  if (isObject(value) && typeof value.id !== 'string') return mapInlineObjectToDraftItem(value)
  return associationValueId(value)
}

function mapAssociationsToDraft(values = []) {
  return ensureArray(values).map(mapAssociationToDraft).filter((value) => value !== null)
}

function mapAssociationToContribution(value, typeKey, associationUse) {
  if (isDraftItem(value)) {
    const association = mapDraftItemToInlineObject(value, typeKey)
    if (associationUse !== undefined) association.use = associationUse
    return association
  }

  const id = associationValueId(value)
  if (id && associationUse !== undefined) return { id, use: associationUse }
  return id
}

/**
 * Builds a schema contribution while tracking which form field produced each schema path.
 */
class TransformCtx {
  constructor(objectType) {
    this.contribution = { 'object-type': objectType }
    this.sourceMap = []
  }

  track(path, field) {
    if (field) this.sourceMap.push({ path, field })
  }

  set(path, value, field, omitIfEmpty = false) {
    if (omitIfEmpty && isEmpty(value)) return
    setPath(this.contribution, path, value)
    this.track(path, field)
  }

  setEntry(path, value, field, omitIfEmpty = false) {
    this.set(path, value, field, omitIfEmpty)
  }

  setTopLevel(path, value, field, omitIfEmpty = false) {
    this.set(path, value, field, omitIfEmpty)
  }

  withSchemaVersion(version) {
    this.contribution.meta = this.contribution.meta || {}
    if (typeof version !== 'undefined') {
      this.contribution.meta.version = version
    }
    return this
  }

  result() {
    return {
      contribution: this.contribution,
      sourceMap: this.sourceMap,
    }
  }
}

function setSharedDraft(ctx, draft) {
  ctx.setTopLevel(['contact', 'name'], draft.contactName ?? '', 'contactName')
  ctx.setTopLevel(['contact', 'emails'], draft.contactEmails ?? '', 'contactEmails')
  ctx.setTopLevel(['additional-info'], draft.additionalInfo ?? '', 'additionalInfo')
  ctx.setEntry(['id'], draft.id ?? '', 'id', true)
  ctx.setEntry(['name'], draft.name ?? '', 'name')
  ctx.setEntry(['references'], mapRefs(draft.references), 'references')
}

const matrixConfig = {
  tactic: {
    associations: matrixAssociations.tactics,
    fields: [],
  },
  technique: {
    associations: matrixAssociations.techniques,
    fields: [],
  },
  mitigation: {
    associations: matrixAssociations.mitigations,
    associationUseFields: {
      techniques: 'techniqueUses',
    },
    fields: [
      {
        draftKey: 'mitigationCategory',
        schemaPath: ['mitigation-category'],
        fallbackSchemaPath: ['category'],
        field: 'mitigationCategory',
      },
      {
        draftKey: 'mlLifecyclePhases',
        schemaPath: ['ml-lifecycle'],
        field: 'mlLifecyclePhases',
        normalize: ensureArray,
      },
    ],
  },
}

/**
 * Maps tactic, technique, and mitigation drafts through the same shared shape.
 */
function mapMatrixDraft(draft, ctx, config) {
  setSharedDraft(ctx, draft)
  ctx.setEntry(['description'], draft.description ?? '', 'description')

  for (const field of config.fields) {
    const rawValue = draft[field.draftKey]
    let value = rawValue
    if (field.normalize) {
      value = field.normalize(rawValue)
    }
    ctx.setEntry(field.schemaPath, value, field.field, true)
  }

  for (const typeKey of config.associations) {
    const useDraftKey = config.associationUseFields?.[typeKey]
    const association = ensureArray(draft[typeKey])
      .map((value) => {
        let associationUse
        if (useDraftKey) {
          const id = associationValueId(value)
          associationUse = isDraftItem(value)
            ? value.use ?? ''
            : draft[useDraftKey]?.[id] ?? value?.use ?? ''
        }

        return mapAssociationToContribution(value, typeKey, associationUse)
      })
      .filter((value) => value !== null)
    ctx.setEntry([typeKey], association, typeKey)
    ctx.setEntry(
      ['items-to-remove', typeKey],
      mapAssociationIds(draft.associationRemovals?.[typeKey]),
      `remove-${typeKey}`,
      true
    )
  }
}

/**
 * Converts the form's case-study date controls into schema date fields.
 */
function setCaseDate(ctx, draft) {
  const year = draft.csYear ?? null
  const month = draft.csMonth ?? null
  const day = draft.csDay ?? null

  if (!year) {
    ctx.setEntry(['incident-date'], '', 'csYear')
    ctx.setEntry(['incident-date-granularity'], '', 'csYear')
    return
  }

  let paddedMonth = '01'
  if (month) {
    paddedMonth = String(month).padStart(2, '0')
  }

  let paddedDay = '01'
  if (day) {
    paddedDay = String(day).padStart(2, '0')
  }

  let granularity = 'YEAR'
  if (month) granularity = 'MONTH'
  if (day) granularity = 'DATE'

  ctx.setEntry(['incident-date'], `${year}-${paddedMonth}-${paddedDay}`, 'csYear')
  ctx.setEntry(['incident-date-granularity'], granularity, 'csYear')
}

const toContribution = {
  tactic: (draft, ctx) => mapMatrixDraft(draft, ctx, matrixConfig.tactic),
  technique: (draft, ctx) => mapMatrixDraft(draft, ctx, matrixConfig.technique),
  mitigation: (draft, ctx) => mapMatrixDraft(draft, ctx, matrixConfig.mitigation),
  'case-study'(draft, ctx) {
    setSharedDraft(ctx, draft)
    ctx.setEntry(['summary'], draft.description ?? '', 'description')
    ctx.setEntry(['case-study-type'], draft.csType ?? null, 'csType')
    ctx.setEntry(['actor'], draft.csActor ?? '', 'csActor')
    ctx.setEntry(['target'], draft.csTarget ?? '', 'csTarget')
    if (draft.csType === 'incident') {
      ctx.setEntry(['reporter'], draft.csReporter ?? '', 'csReporter')
    }
    ctx.setEntry(['procedure'], mapProcedures(draft.csProcedures), 'csProcedures')
    setCaseDate(ctx, draft)
  },
  other(draft, ctx) {
    setSharedDraft(ctx, draft)
    ctx.setEntry(['description'], draft.description ?? '', 'description')
  },
}

function emptyDraft(objectType = 'technique') {
  return {
    id: '',
    'object-type': objectType,
    contactName: '',
    contactEmails: '',
    name: '',
    mitigationCategory: null,
    mlLifecyclePhases: [],
    description: '',
    tactics: [],
    mitigations: [],
    techniques: [],
    techniqueUses: {},
    associationRemovals: {},
    references: [],
    additionalInfo: '',
    fileName: '',
    maturity: undefined,
    csType: null,
    csActor: '',
    csTarget: '',
    csReporter: '',
    csYear: null,
    csMonth: null,
    csDay: null,
    csProcedures: [],
  }
}

function hydrateShared(draft, entry, payload) {
  draft.contactName = payload?.contact?.name ?? entry?.contact?.name ?? ''
  draft.contactEmails = payload?.contact?.emails ?? entry?.contact?.emails ?? ''
  draft.additionalInfo = payload?.['additional-info'] ?? entry?.['additional-info'] ?? ''
  draft.name = entry?.name ?? ''
  draft.references = mapRefs(entry?.references)
}

/**
 * Hydrates tactic, technique, and mitigation entries through the shared matrix shape.
 */
function hydrateMatrix(draft, entry, payload, config) {
  hydrateShared(draft, entry, payload)
  draft.description = entry?.description ?? ''

  for (const field of config.fields) {
    const rawValue = getPath(entry, field.schemaPath)
    let value = rawValue ?? null
    if (value === null && field.fallbackSchemaPath) {
      value = getPath(entry, field.fallbackSchemaPath) ?? null
    }
    if (field.draftKey === 'mitigationCategory' && Array.isArray(value)) {
      value = value.length === 1 ? value[0] : null
    }
    if (field.normalize) {
      value = field.normalize(value)
    }
    draft[field.draftKey] = value
  }

  for (const typeKey of config.associations) {
    const useDraftKey = config.associationUseFields?.[typeKey]
    draft[typeKey] = mapAssociationsToDraft(entry?.[typeKey])
    if (useDraftKey) {
      draft[useDraftKey] = {}
      for (const value of ensureArray(entry?.[typeKey])) {
        const id = associationValueId(value)
        if (id && isObject(value)) draft[useDraftKey][id] = value.use ?? ''
      }
    }
    draft.associationRemovals[typeKey] = mapAssociationIds(entry?.['items-to-remove']?.[typeKey])
  }
}

/**
 * Splits a schema incident date back into the form's year/month/day controls.
 */
function hydrateDate(draft, entry) {
  if (!entry?.['incident-date']) return

  const granularity = entry['incident-date-granularity']
  const parts = String(entry['incident-date']).split('-')
  const year = parseInt(parts[0], 10)

  let month = NaN
  if (parts.length > 1) {
    month = parseInt(parts[1], 10)
  }

  let day = NaN
  if (parts.length > 2) {
    day = parseInt(parts[2], 10)
  }

  draft.csYear = null
  if (!isNaN(year)) {
    draft.csYear = year
  }

  if (granularity === 'MONTH' || granularity === 'DATE') {
    draft.csMonth = null
    if (!isNaN(month)) {
      draft.csMonth = month
    }
  }

  if (granularity === 'DATE') {
    draft.csDay = null
    if (!isNaN(day)) {
      draft.csDay = day
    }
  }
}

const toDraft = {
  tactic: (entry, payload, draft) => hydrateMatrix(draft, entry, payload, matrixConfig.tactic),
  technique: (entry, payload, draft) =>
    hydrateMatrix(draft, entry, payload, matrixConfig.technique),
  mitigation: (entry, payload, draft) =>
    hydrateMatrix(draft, entry, payload, matrixConfig.mitigation),
  'case-study'(entry, payload, draft) {
    hydrateShared(draft, entry, payload)
    draft.description = entry?.summary ?? ''
    draft.csType = entry?.['case-study-type'] ?? null
    draft.csActor = entry?.actor ?? ''
    draft.csTarget = entry?.target ?? ''
    draft.csReporter = entry?.reporter ?? ''
    draft.csProcedures = mapProceduresToDraft(entry?.procedure)
  },
  other(entry, payload, draft) {
    hydrateShared(draft, entry, payload)
    draft.description = entry?.description ?? ''
  },
}

function cleanPath(path = [], error = {}) {
  let normalized = []
  if (Array.isArray(path)) {
    normalized = path.filter((segment) => typeof segment !== 'number')
  }

  if (normalized[0] === 'submissions') normalized = normalized.slice(1)
  if (normalized[0] === 'study') normalized = normalized.slice(1)
  if (error.name === 'required' && typeof error.argument === 'string') {
    normalized = [...normalized, error.argument]
  }

  return normalized
}

function fieldForPath(path = [], error = {}, sourceMap = []) {
  const normalizedPath = cleanPath(path, error)
  let bestMatch = null

  for (const mapping of sourceMap) {
    const isPrefixMatch = mapping.path.every((segment, index) => normalizedPath[index] === segment)
    if (!isPrefixMatch) continue
    if (!bestMatch || mapping.path.length > bestMatch.path.length) {
      bestMatch = mapping
    }
  }

  return bestMatch?.field ?? null
}

function buildContribution(draft, typeKey) {
  const sanitizedDraft = trimStringValues(draft)
  const objectType = typeToObject[typeKey] || typeKey
  const transformer = toContribution[objectType]
  const ctx = new TransformCtx(objectType)

  if (transformer) {
    transformer(sanitizedDraft, ctx)
  } else {
    setSharedDraft(ctx, sanitizedDraft)
  }

  const { contribution, sourceMap } = ctx.withSchemaVersion(schema?.$version).result()
  return { contribution, sourceMap }
}

function hydrateDraft(entry, payload) {
  const objectType = entry?.['object-type'] || 'technique'
  const draft = emptyDraft(objectType)
  draft.id = entry?.id ?? ''
  const transformer = toDraft[objectType]

  if (transformer) transformer(entry, payload, draft)
  else hydrateShared(draft, entry, payload)

  hydrateDate(draft, entry)

  return trimStringValues(draft)
}

/**
 * Hoists nested definitions from oneOf/anyOf branches so local $ref paths resolve.
 */
function normalizedSchema() {
  try {
    const clone = JSON.parse(JSON.stringify(schema))
    clone.definitions = clone.definitions || {}
    const submissionItems = clone?.properties?.submissions?.items
    const branches = submissionItems?.oneOf || submissionItems?.anyOf || []

    for (const branch of branches) {
      if (!branch?.definitions) continue

      for (const [key, definition] of Object.entries(branch.definitions)) {
        if (!(key in clone.definitions)) {
          clone.definitions[key] = definition
        }
      }
    }
    return clone
  } catch (e) {
    return schema
  }
}

/**
 * Converts jsonschema validation errors into user-facing strings.
 */
function errorMessages(errors) {
  return errors.map((e) => `File Error: ${e.message}`)
}

function definitionFor(objectType, definitions) {
  const definitionKey = objectToDef[objectType]
  if (!definitionKey) return null

  return definitions?.[definitionKey] ?? null
}

function formatError(error, fieldKey) {
  if (error.name === 'required' && typeof error.argument === 'string') {
    switch (error.argument) {
      case 'name':
        return 'This field is required.'
      case 'description':
      case 'summary':
        return 'A summary is required.'
      case 'incident-date':
        return 'A case study year is required.'
      case 'incident-date-granularity':
        return 'A case study date granularity is required.'
      case 'procedure':
        return 'At least one procedure step is required.'
      default:
        return `${error.argument} is required.`
    }
  }

  if (error.name === 'pattern') {
    if (fieldKey?.startsWith('remove-')) {
      const typeKey = fieldKey.slice('remove-'.length)
      const typeWord = contributionTypeWordFromKey(typeKey, true)
      return `One or more suggested ${typeWord} removals are not valid ATLAS IDs.`
    }
    if (fieldKey === 'tactics')
      return 'One or more associated tactics are not valid ATLAS tactic IDs.'
    if (fieldKey === 'techniques')
      return 'One or more associated techniques are not valid ATLAS technique IDs.'
    if (fieldKey === 'mitigations')
      return 'One or more associated mitigations are not valid ATLAS mitigation IDs.'
  }

  if (error.name === 'enum') {
    return 'Please choose one of the allowed values.'
  }

  if (error.name === 'format' && ['csYear', 'csMonth', 'csDay'].includes(fieldKey)) {
    return 'The case study date is not valid.'
  }

  return error.message || 'This value is invalid.'
}

function uniqueErrors(errors) {
  const seen = new Set()
  return errors.filter((error) => {
    const key = `${error.field || ''}:${error.message}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function entryErrors(entry, normalized, sourceMap = []) {
  const submissionErrors = []
  const definitions = normalized?.definitions || {}
  const objectType = entry?.study?.['object-type'] || entry?.['object-type']
  const submissionSchema = definitionFor(objectType, definitions)

  if (!submissionSchema || !entry) return submissionErrors

  const schemaWithDefinitions = {
    ...submissionSchema,
    definitions,
  }

  const result = validate(entry, schemaWithDefinitions, { nestedErrors: true })
  for (const error of result.errors) {
    if (error.name === 'anyOf' || error.name === 'oneOf') continue
    const path = Array.isArray(error.path) ? error.path : []
    const field = fieldForPath(path, error, sourceMap)
    if (field === 'csProcedures' && error.name === 'pattern') continue

    submissionErrors.push({
      field,
      message: formatError(error, field),
      path,
      raw: error,
    })
  }

  return submissionErrors
}

function submissionErrors(payload, normalized, sourceMaps = []) {
  const submissions = ensureArray(payload?.submissions)
  return submissions.flatMap((submission, index) => {
    const sourceMap = sourceMaps[index] || []
    return entryErrors(submission, normalized, sourceMap)
  })
}

function topErrors(payload, normalized, sourceMap = []) {
  const errors = []

  const contactSchema = normalized?.definitions?.contact
  if (contactSchema) {
    const result = validate(payload?.contact, contactSchema, { nestedErrors: true })
    for (const error of result.errors) {
      const path = ['contact', ...(Array.isArray(error.path) ? error.path : [])]
      const field = fieldForPath(path, error, sourceMap)
      errors.push({
        field,
        message: formatError(error, field),
        path,
        raw: error,
      })
    }
  }

  if (typeof payload?.['additional-info'] !== 'string') {
    errors.push({
      field: 'additionalInfo',
      message: 'Additional info must be plain text.',
      path: ['additional-info'],
      raw: null,
    })
  }

  return errors
}

/**
 * Validates a wrapped contribution payload and keeps form source maps when available.
 */
function validationResult(payload, sourceMaps = []) {
  const normalized = normalizedSchema()
  const errors = uniqueErrors([
    ...topErrors(payload, normalized, sourceMaps[0] || []),
    ...submissionErrors(payload, normalized, sourceMaps),
  ])

  return {
    valid: errors.length === 0,
    payload,
    errors,
  }
}

/**
 * Maps a FormStructure draft into the schema contribution object.
 */
export function mapDraftToContribution(draft, typeKey) {
  return buildContribution(draft, typeKey).contribution
}

function unwrapRoot(contributionObj) {
  const submission = ensureArray(contributionObj?.submissions)[0]
  const root = submission?.study ?? submission ?? contributionObj?.study ?? contributionObj
  return {
    root,
    payload: {
      contact: contributionObj?.contact,
      'additional-info': contributionObj?.['additional-info'],
    },
  }
}

/**
 * Normalizes form submissions into schema submission objects.
 */
function normalizeSubmission(item) {
  if (!isObject(item)) return null

  let copy = { ...item }
  if (isObject(item.study)) {
    copy = { ...item.study }
  }

  delete copy.contact
  delete copy['additional-info']
  delete copy.meta

  if (copy['object-type'] === 'case-study' || isObject(item.study)) {
    const wrapped = { study: copy }
    if (isObject(item.meta)) wrapped.meta = item.meta
    return wrapped
  }

  return copy
}

/**
 * Wraps a single contribution or draft export into the schema's umbrella payload.
 */
function wrapPayload(obj) {
  if (Array.isArray(obj?.submissions) && obj?.contact) {
    return {
      ...obj,
      submissions: obj.submissions
        .map((submission) => normalizeSubmission(submission))
        .filter((submission) => isObject(submission)),
    }
  }

  const topContact = obj?.contact || { name: '', emails: '' }
  const addInfo = obj?.['additional-info'] || ''

  if (obj && 'study' in obj) {
    return {
      contact: topContact,
      'additional-info': addInfo,
      submissions: [normalizeSubmission(obj)],
    }
  }

  const inner = { ...(obj || {}) }
  delete inner.contact
  delete inner['additional-info']

  const primaryItem = normalizeSubmission(inner)
  const submissions = [primaryItem].filter((submission) => isObject(submission))

  return { contact: topContact, 'additional-info': addInfo, submissions }
}

/**
 * Reverse-maps a schema contribution or website payload into the FormStructure draft model.
 */
export function mapContributionToDraft(contributionObj) {
  const { root, payload } = unwrapRoot(contributionObj)
  return hydrateDraft(root, payload)
}

/**
 * Returns the form contribution type key for an uploaded contribution payload.
 */
export function getContributionTypeKey(contributionObj) {
  const { root } = unwrapRoot(contributionObj)
  return objectToType[root?.['object-type']] ?? null
}

/**
 * Performs lightweight validation for resumable draft uploads.
 */
export function validateContributionResumeFile(contributionObj) {
  const typeKey = getContributionTypeKey(contributionObj)

  if (!typeKey) {
    return ['This file is not a supported ATLAS contribution draft.']
  }

  const associationErrors = matrixAssociationErrors(contributionObj)
  if (associationErrors.length) {
    return associationErrors
  }

  try {
    mapContributionToDraft(contributionObj)
  } catch (error) {
    if (error instanceof Error && error.message) {
      return [error.message]
    }

    return ['Unable to read contribution draft.']
  }

  return ''
}

/**
 * Validates against the contribution schema and returns user-facing error strings.
 */
export function validateContribution(contributionObj) {
  const result = validateContributionDetailed(contributionObj)
  if (result.valid) return ''

  return errorMessages(result.errors)
}

/**
 * Validates a contribution object and returns field-aware raw validation details.
 */
export function validateContributionDetailed(contributionObj) {
  const payload = wrapPayload(contributionObj)
  return validationResult(payload)
}

/**
 * Validates a form draft and preserves source-map links back to form fields.
 */
export function validateContributionDraftDetailed(draft, typeKey) {
  const { contribution, sourceMap } = buildContribution(draft, typeKey)
  const payload = wrapPayload(contribution)
  const sourceMaps = [sourceMap]
  return validationResult(payload, sourceMaps)
}

/**
 * Checks whether a contribution carries a stale schema version.
 */
export function isContributionSchemaOutdated(contributionObj) {
  const current = contributionObj?.meta?.version
  const expected = schema?.$version
  return typeof expected !== 'undefined' && current !== expected
}

/**
 * Downloads a contribution payload as YAML.
 */
export function downloadContributionFile(contributionObj, filename) {
  const payload = wrapPayload(contributionObj)
  const content = dump(payload, { noRefs: true })
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
  element.setAttribute('download', `${filename || contributionObj.name || 'contribution'}.yaml`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
