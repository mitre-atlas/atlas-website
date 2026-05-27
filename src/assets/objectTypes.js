const OBJECT_TYPE_INFO = {
  tactics: {
    title: 'Tactic',
    pluralTitle: 'Tactics',
    objectType: 'tactic',
    definitionKey: 'tactic'
  },
  techniques: {
    title: 'Technique',
    pluralTitle: 'Techniques',
    objectType: 'technique',
    definitionKey: 'technique'
  },
  mitigations: {
    title: 'Mitigation',
    pluralTitle: 'Mitigations',
    objectType: 'mitigation',
    definitionKey: 'mitigation'
  },
  studies: {
    title: 'Case Study',
    pluralTitle: 'Case Studies',
    objectType: 'case-study',
    definitionKey: 'case_study'
  },
  other: {
    title: 'General Contribution',
    pluralTitle: 'General Contributions',
    objectType: 'other',
    definitionKey: 'other'
  }
}

const TYPE_KEY_BY_OBJECT_TYPE = Object.fromEntries(
  Object.entries(OBJECT_TYPE_INFO).map(([typeKey, { objectType }]) => [objectType, typeKey])
)

const DEFINITION_KEY_BY_OBJECT_TYPE = Object.fromEntries(
  Object.values(OBJECT_TYPE_INFO).map(({ objectType, definitionKey }) => [objectType, definitionKey])
)

const TYPE_KEY_ALIASES = {
  'case-studies': 'studies'
}

const STORE_OBJECT_COLLECTION_KEYS = {
  studies: 'case-studies'
}

export const MATRIX_TYPE_KEYS = ['tactics', 'techniques', 'mitigations']
export const DATA_ROUTE_TYPE_KEYS = [...MATRIX_TYPE_KEYS, 'studies']

export function isDataRouteTypeKey(typeKey = '') {
  return DATA_ROUTE_TYPE_KEYS.includes(normalizeTypeKey(typeKey))
}

export function isMatrixTypeKey(typeKey = '') {
  return MATRIX_TYPE_KEYS.includes(normalizeTypeKey(typeKey))
}

export function getStoreObjectCollectionKey(typeKey = '') {
  const normalized = normalizeTypeKey(typeKey)
  return STORE_OBJECT_COLLECTION_KEYS[normalized] ?? normalized
}

export function normalizeTypeKey(typeKey = '') {
  return TYPE_KEY_ALIASES[typeKey] ?? typeKey
}

export function getObjectTypeInfo(typeKey = '') {
  const normalized = normalizeTypeKey(typeKey)
  return OBJECT_TYPE_INFO[normalized] ?? null
}

export function getObjectTypeFromTypeKey(typeKey = '') {
  return getObjectTypeInfo(typeKey)?.objectType ?? ''
}

export function getTypeKeyFromObjectType(objectType = '') {
  return TYPE_KEY_BY_OBJECT_TYPE[objectType] ?? null
}

export function getDefinitionKeyFromObjectType(objectType = '') {
  return DEFINITION_KEY_BY_OBJECT_TYPE[objectType] ?? null
}

export function isKnownTypeKey(typeKey = '') {
  return getObjectTypeInfo(typeKey) !== null
}

export function getTypeLabel(typeKey = '', lowercase = false, plural = false) {
  const info = getObjectTypeInfo(typeKey)
  let label = plural ? info?.pluralTitle : info?.title
  label = label ?? ''
  return lowercase ? label.toLowerCase() : label
}

export function getObjectTypeRoutePlural(objectType = '') {
  const typeKey = getTypeKeyFromObjectType(objectType)
  return typeKey ?? ''
}

export function getObjectTypeOptions(includeOther = true) {
  return Object.entries(OBJECT_TYPE_INFO)
    .filter(([typeKey]) => includeOther || typeKey !== 'other')
    .map(([value, { title }]) => ({ value, title }))
}
