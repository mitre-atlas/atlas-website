import { defineStore } from 'pinia'

import yaml from 'js-yaml'

import { dataObjectToRoute } from '@/assets/dataHelpers.js'
import { ATLAS_DATA_VERSION, assertApiModeVersionConfigured, isApiMode } from '@/config/env'
import { collectUniqueArrayValues, getPathWithBase } from '@/assets/tools'

/**
 * Keys that will not be considered as properties or references to other data objects
 * @type {string[]}
 */
const DEFAULT_DATA_OBJECT_KEYS = ['id', 'object-type', 'name', 'description', 'attack-reference']

/**
 * Keys added as part of the nuxtServerInit ingest for website use.
 * To be stripped from objects before export.
 * @type {string[]}
 */
export const EXTRA_ADDED_WEBSITE_KEYS = ['route', 'label', 'columnNames']

/**
 * Creates a deep copy of the provided data object, limited to defined keys.
 * Used to provide a reference object for linking
 *
 * @param {Object} obj
 * @param {string[]} extraKeys
 * @returns {Object} Copied data object
 * @private
 */
const deepCopyDefault = (obj, extraKeys) => {
  let keysToKeep = [...DEFAULT_DATA_OBJECT_KEYS, ...EXTRA_ADDED_WEBSITE_KEYS]
  if (typeof extraKeys !== 'undefined') {
    // Add specified keys if present
    keysToKeep = keysToKeep.concat(extraKeys)
  }
  return JSON.parse(JSON.stringify(obj, keysToKeep))
}

function isValidAtlasData(data) {
  if (!data || typeof data !== 'object') return false
  const matrixId = data?.matrix?.id
  const collectionId = data?.collection?.id
  return typeof matrixId === 'string' && matrixId.length > 0 && typeof collectionId === 'string'
}

function looksLikeHtml(text) {
  const value = String(text || '')
    .trim()
    .toLowerCase()
  return value.startsWith('<!doctype html') || value.startsWith('<html')
}

export const useMain = defineStore('main', {
  state: () => ({
    /**
     * ATLAS Data as read from ATLAS.yaml
     * @type {Object}
     * @alias state: data
     */
    data: {
      objects: {},
      matrices: [],
      allDataObjects: [],
      objectsById: {},
      relationshipIndex: {
        outgoingBySourceId: {},
        incomingByTargetId: {},
      },
    },
    /**
     * Whether to show the navigation drawer on pages
     * @type {boolean}
     * @alias state: doShowNavDrawer
     */
    doShowNavDrawer: true,
    /**
     * Whether to show the annoucement banner on pages
     */
    doShowAnnoucementBanner: false,
    /**
     * Accepted values for the _objectTypePlural route
     */
    objectTypePluralValues: [],
    /**
     * Whether the 404 page is currently displayed
     */
    pageNotFoundDisplaying: false,
    categoryValues: [],
    mlLifecycleValues: [],
    relatedObjectsCache: {},
    dataLoadError: '',
    preferredVersion: '',
    currentRouteVersion: '',
    latestKnownVersion: '',
    latestVersionLoadError: '',
    manifestEntries: [],
  }),
  // other options...
  getters: {
    /**
     * Retrieves the ATLAS Data value for the specified key
     * @alias mapGetters: getDataAttribute
     */
    getDataAttribute: (state) => (key) => state.data[key],

    /**
     * Get a single array of all objects
     * @returns {object[]}
     */
    getDataObjects: (state) => state.data?.allDataObjects || [],

    /**
     * Get array containing the names of all the object types
     * @returns {string[]}
     */
    getDataObjectTypes: (state) => Object.keys(state.data?.objects || {}),

    /**
     * Returns data objects under the provided object type, either as an object of { matrixId: [objs] }
     * for ex. tactic or technique index page use in filtering, or an array of data objects for ex.
     * case study index page use.
     *
     * @param {String} objType - Value of the data object's `object-type` field
     * @param {string} [matrixId] - Key for the matrix under the `matrices` ATLAS Data object
     * @param {boolean} [returnObject] - Whether to return an object instead of an array
     * @returns {object|object[]} Data objects matching the type
     * @alias mapGetters: getDataObjectsByType
     */
    getDataObjectsByType: (state) => (objType, matrixId, returnObject) => {
      const objects = state.data?.objects || {}

      // Returns a list of data objects under the provided object type
      // or an empty Array if not found
      // Ex. in rendering the studies page when there is no case-studies key in the data
      const content = objects[objType]

      if (typeof returnObject !== 'undefined' && returnObject) {
        // Return the object with keys of matrix ID and values of data objects
        return content || {}
      }

      if (!content) {
        return []
      }

      if (typeof matrixId === 'undefined') {
        // This is a top-level key containing an array of data objects
        if (Array.isArray(content)) {
          return content
        }
        // Otherwise this is an object keyed by matrix ID,
        // and the ID is is not specified
        // Return the all matrices' objects of this type
        if (typeof content === 'object') {
          return Object.values(content).flat()
        }

        return []
      }

      if (typeof content !== 'object') {
        return []
      }

      // Otherwise access the matrix's objects by ID
      return content[matrixId] ?? []
    },

    /**
     * Retrieves an array of data objects of a specific type, optionally that belong to a specific matrix,
     * that contain a specified key and value.
     *
     * @param {string} objType - Value of the data object's `object-type` field
     * @param {string} key - Data object key field with which to match
     * @param {string} value - Value of the data object key field with which to match
     * @param {string} [matrixId] - The key for the matrix under the `matrices` ATLAS Data object
     * @returns {object[]} Array of data objects matching the parameters
     */
    getDataObjectsByTypeKeyValue: function () {
      return function (objType, key, value, matrixId) {
        // Retrieves a list of data objects
        const objs = this.getDataObjectsByType(objType, matrixId)
        // Return the first data object whose key-value matches the provided value argument
        return objs.filter((obj) => obj[key] === value)
      }
    },

    /**
     * Retrieves an array of deep-copied data objects of a specific type, optionally that belong to a specific matrix,
     * that contain a specified key and value.
     * Used when the objects are to be further modified without changing the store data
     *
     * @param {string} objType - Value of the data object's `object-type` field
     * @param {string} key - Data object key field with which to match
     * @param {string} value - Value of the data object key field with which to match
     * @param {string} [matrixId] - The key for the matrix under the `matrices` ATLAS Data object
     * @returns {object[]} Array of data objects matching the parameters
     */
    getDataObjectsByTypeKeyValueDeepCopyDefault: function () {
      return function (objType, key, value, matrixId) {
        // Retrieves a deep copy of a list of data objects, keeping only default data keys
        let objs = this.getDataObjectsByTypeKeyValue(objType, key, value, matrixId)
        // Deep copy only the default data keys, i.e. id, name, route for linking
        objs = objs.map((obj) => deepCopyDefault(obj, [key]))
        return objs
      }
    },

    /**
     * Retrieves an array of data objects of a specific type, optionally that belong to a specific matrix,
     * that contain the specified nested key in the array under the given key. The array is filtered to only contain
     * items that match the specified value(s) for the nested key.
     * If the object has an empty array under the key after filtering, it is removed.
     *
     * @param {string} objType - Value of the data object's `object-type` field
     * @param {string} key - Data object key field with which to match
     * @param {string} nested_key - Data object nested key field with which to match
     * @param {string[]} values - Array of values of the data object nested key field with which to match
     * @param {string} [matrixId] - The key for the matrix under the `matrices` ATLAS Data object
     * @returns {object[]} Array of data objects matching the parameters
     */

    getDataObjectsFilteredbyNestedKeyValue: function () {
      return function (objType, key, nested_key, values, matrixId) {
        const objs = this.getDataObjectsByType(objType, matrixId)
        return objs
          .filter((obj) => key in obj)
          .map((obj) => {
            // Clone the object and filter the array under 'key'
            const newObj = { ...obj }
            newObj[key] = obj[key].filter((item) => values.includes(item[nested_key]))
            return newObj
          })
          .filter((obj) => obj[key].length > 0) // Only keep objects with matches
      }
    },

    /**
     * Returns case-study procedure technique options for a selected tactic.
     * Output is flattened as parent technique followed by its subtechniques,
     * with unique IDs for safe v-autocomplete item-value usage.
     *
     * @param {string} tacticId - Selected tactic id
     * @returns {object[]} Technique and subtechnique options
     */
    getProcedureTechniqueOptionsByTactic: function () {
      return function (tacticId) {
        if (!tacticId) {
          return []
        }

        const tactic = this.getDataObjectById(tacticId)
        if (!tactic || !Array.isArray(tactic.techniques)) {
          return []
        }

        const options = []
        const seenIds = new Set()

        tactic.techniques.forEach((technique) => {
          if (!technique?.id || seenIds.has(technique.id)) {
            return
          }

          seenIds.add(technique.id)
          options.push(technique)

          const subtechniques = Array.isArray(technique.subtechniques)
            ? technique.subtechniques
            : []

          subtechniques.forEach((subtechnique) => {
            if (!subtechnique?.id || seenIds.has(subtechnique.id)) {
              return
            }

            seenIds.add(subtechnique.id)
            options.push({
              ...subtechnique,
              'subtechnique-of': technique.id,
            })
          })
        })

        return options
      }
    },

    /**
     * Returns an object with key/object-type to array of objects referenced by this object.
     * Re-keys specific items including "subtechnique-of" for title display purposes.
     *
     * @param {object} argObj - Data object
     * @returns {object} Object of associated data objects
     */
    getReferencedDataObjects: function (state) {
      return function (argObj) {
        const referencedObjects = {}
        const outgoing = state.data.relationshipIndex?.outgoingBySourceId?.[argObj.id] || {}

        if (outgoing.achieves?.length) {
          const tacticObjs = outgoing.achieves
            .map((rel) => this.getDataObjectByIdDeepCopyDefault(rel.target))
            .filter(Boolean)
          if (tacticObjs.length > 0) {
            referencedObjects.tactics = tacticObjs
          }
        }

        if (outgoing.specializes?.length) {
          const parentTechniqueId = outgoing.specializes[0].target
          const parentTechnique = this.getDataObjectById(parentTechniqueId)
          if (parentTechnique) {
            referencedObjects['parent-technique'] = [parentTechnique]
            referencedObjects.tactics = (parentTechnique.tactics || [])
              .map((id) => this.getDataObjectByIdDeepCopyDefault(id))
              .filter(Boolean)
          }
        }

        if (outgoing.mitigates?.length) {
          referencedObjects.technique = outgoing.mitigates
            .map((rel) => this.getDataObjectByIdDeepCopyDefault(rel.target))
            .filter(Boolean)
        }

        return referencedObjects
      }
    },

    /**
     * Returns an object with key/object-type to array of deep-copied objects that reference this object.
     * Re-keys specific items including "subtechniques" for title display purposes.
     * Handles case studies separately.
     *
     * @param {object} argObj - Data object
     * @returns {object} Object of associated data objects
     */
    getDataObjectsReferencing: function (state) {
      return function (argObj) {
        const id = argObj.id
        const incoming = state.data.relationshipIndex?.incomingByTargetId?.[id] || []
        const sourceIdSet = new Set(
          incoming.map((rel) => rel.source).filter((sourceId) => sourceId !== id)
        )
        let objects = Array.from(sourceIdSet)
          .map((sourceId) => this.getDataObjectByIdDeepCopyDefault(sourceId, ['subtechnique-of']))
          .filter(Boolean)

        // Other subtechniques
        if (argObj['object-type'] === 'technique' && 'subtechnique-of' in argObj) {
          const parentTechniqueId = id.substring(0, id.lastIndexOf('.'))
          const otherSubtechniques = this.getDataObjectsByTypeKeyValueDeepCopyDefault(
            'techniques',
            'subtechnique-of',
            parentTechniqueId
          )
          // Add other subtechniques that aren't this one
          objects = objects.concat(otherSubtechniques.filter((t) => t.id !== id))
        }

        // Add subtechniques of tactics to the technique list
        if (argObj['object-type'] === 'tactic') {
          let subtechniques = []
          objects.forEach((obj) => {
            if (obj['object-type'] === 'technique') {
              subtechniques = subtechniques.concat(
                this.getDataObjectsByTypeKeyValueDeepCopyDefault(
                  'techniques',
                  'subtechnique-of',
                  obj.id
                )
              )
            }
          })
          objects = objects.concat(subtechniques)
        }

        // Group by object type
        const results = objects.reduce((acc, obj) => {
          var objectType = obj['object-type']
          if (!acc[objectType]) {
            acc[objectType] = []
          }
          acc[objectType].push(obj)
          return acc
        }, {})

        // Label subtechniques if available
        if ('technique' in results && argObj['object-type'] === 'technique') {
          let subtechniqueKey = 'subtechniques'
          if (argObj['object-type'] === 'technique' && 'subtechnique-of' in argObj) {
            subtechniqueKey = 'other subtechniques'
          }
          // Relabel the techniques found, that aren't a parent technique
          const subts = results['technique'].filter((t) => 'subtechnique-of' in t)
          if (subts.length) {
            results[subtechniqueKey] = subts
          }
          delete results['technique']
        }

        return results
      }
    },

    /**
     * Returns an object of key/object-type to array of data objects related to this object
     * @returns {Object} Related data objects, keyed by display title or data object type
     */
    getRelatedDataObjects: function (state) {
      return function (argObj) {
        if (argObj?.id && state.relatedObjectsCache[argObj.id]) {
          return state.relatedObjectsCache[argObj.id]
        }

        // Returns an object of key/object-type to array of data objects related to this object
        const relatedObjs = {
          ...this.getReferencedDataObjects(argObj),
          ...this.getDataObjectsReferencing(argObj),
        }

        const nonEmptyRelatedObjs = Object.entries(relatedObjs).reduce((acc, [key, value]) => {
          if (value === undefined || value === null) {
            return acc
          }

          if (Array.isArray(value) && value.length === 0) {
            return acc
          }

          acc[key] = value
          return acc
        }, {})

        // Sort object keys in alphabetical order for display
        const result = Object.keys(nonEmptyRelatedObjs)
          .sort()
          .reduce((acc, key) => {
            acc[key] = nonEmptyRelatedObjs[key]
            return acc
          }, {})

        if (argObj?.id) {
          state.relatedObjectsCache[argObj.id] = result
        }

        return result
      }
    },

    /**
     * Retrieve a data object by ID
     * @param {string} value - Data object ID
     * @returns {object} Matching data object
     * @alias mapGetters: getDataObjectById
     */
    getDataObjectById: function (state) {
      return function (value) {
        const objectById = state.data.objectsById?.[value]
        if (objectById) {
          return objectById
        }
        // Returns the data object with the corresponding ID
        const allDataObjects = this.getDataObjects || []
        return allDataObjects.find((obj) => obj['id'] === value)
      }
    },

    /**
     * Retrieve a data object by ID, deep-copying the object with only default keys present
     * @param {string} value - Data object ID
     * @returns {object} Matching data object
     */
    getDataObjectByIdDeepCopyDefault: function () {
      return function (value, extraKeys) {
        // Returns a deep copy of the the data object with the corresponding ID, with only default data keys present
        let obj = this.getDataObjectById(value)
        // Deep copy, only keeping default keys, i.e. id, name, route, for linking
        if (obj) {
          obj = deepCopyDefault(obj, extraKeys)
        }
        return obj
      }
    },

    /**
     * Retrieves the ID of the first matrix
     * @returns {string} matrix ID
     * @alias mapGetters: getFirstMatrixId
     */
    getFirstMatrixId: (state) => state.data.matrices?.[0]?.id || '',

    /**
     * Retrieves an array of matrix IDs
     * @returns {string[]} matrix IDs
     */
    getMatrixIds: (state) => {
      return (state.data?.matrices || []).map((obj) => obj.id)
    },

    /**
     * Retrieve a matrix object by ID
     * @param {string} value - Matrix ID
     * @returns {object} Matching matrix object containing keys to data object arrays
     * @alias mapGetters: getMatrixByID
     */
    getMatrixByID: (state) => (value) => {
      return (state.data?.matrices || []).find((obj) => obj['id'] === value)
    },
    /**
     * Retrieves whether the annoucement banner should be displayed
     * @alias mapGetters: getDoShowAnnoucementBanner
     */
    getDoShowAnnoucementBanner: (state) => state.doShowAnnoucementBanner,
    /**
     * Retrieves the array of accepted _objectTypePlural values
     */
    getObjectTypePluralValues: (state) => state.objectTypePluralValues,
    /**
     * Retrieve the parent object of this subtechnique, if any.
     *
     * @param {object} subtechnique - A subtechnique data object
     * @returns {object|null} The subtechnique's parent object, or null
     * @alias mapGetters: subtechnique/getParent
     */
    getParent: function () {
      return function (subtechnique) {
        if ('subtechnique-of' in subtechnique) {
          const parentTechniqueId = subtechnique['subtechnique-of']
          return this.getDataObjectById(parentTechniqueId)
        }
        return null
      }
    },

    getActiveNavigationVersion: (state) => state.currentRouteVersion || state.preferredVersion,

    getCanonicalLatestVersion: (state) => ATLAS_DATA_VERSION || state.latestKnownVersion || '',
  },
  actions: {
    /**
     * Sets the data as loaded in from file
     * @param {object} payload - ATLAS.yaml data
     */
    SET_ATLAS_DATA(payload) {
      this.data = { ...this.data, ...payload }
    },
    /**
     * Sets or toggles the visiblity of the navigation drawer
     * @param {boolean} [status] - Whether the navigation drawer should be open. If omitted, toggles the state.
     * @alias mapMutations: TOGGLE_NAV_DRAWER
     */
    TOGGLE_NAV_DRAWER(status) {
      if (typeof status === 'undefined') {
        // Toggle state
        this.doShowNavDrawer = !this.doShowNavDrawer
      } else if (typeof status === 'boolean') {
        // Set state
        this.doShowNavDrawer = status
      }
    },
    /**
     * Disables the visiblity of the annoucement banner
     * @alias mapMutations: DISMISS_ANNOUCEMENT_BANNER
     */
    DISMISS_ANNOUCEMENT_BANNER() {
      // Set visibility to false
      this.doShowAnnoucementBanner = false
    },
    /**
     * Sets the accepted _objectTypePlural values as parsed from the ATLAS.yaml file
     * @param {string[]} payload
     */
    SET_OBJECT_TYPE_PLURAL_VALUES(payload) {
      this.objectTypePluralValues = [...payload]
    },

    SET_CATEGORY_VALUES(payload) {
      this.categoryValues = [...payload]
    },

    SET_ML_LIFECYCLE_VALUES(payload) {
      this.mlLifecycleValues = [...payload]
    },

    SET_PREFERRED_VERSION(version) {
      const normalizedVersion = typeof version === 'string' ? version.trim() : ''
      this.preferredVersion = normalizedVersion
      if (typeof window !== 'undefined') {
        if (normalizedVersion) {
          window.sessionStorage.setItem('atlas-preferred-version', normalizedVersion)
        } else {
          window.sessionStorage.removeItem('atlas-preferred-version')
        }
      }
    },

    LOAD_PREFERRED_VERSION() {
      if (typeof window === 'undefined') {
        return ''
      }

      const storedVersion = window.sessionStorage.getItem('atlas-preferred-version') || ''
      this.preferredVersion = storedVersion
      return storedVersion
    },

    SYNC_ROUTE_VERSION(routeLike) {
      const nextVersion =
        typeof routeLike?.params?.version === 'string' ? routeLike.params.version : ''
      this.currentRouteVersion = nextVersion
      return nextVersion
    },

    async LOAD_LATEST_KNOWN_VERSION() {
      this.latestVersionLoadError = ''

      if (ATLAS_DATA_VERSION) {
        this.latestKnownVersion = ATLAS_DATA_VERSION
        return this.latestKnownVersion
      }

      return this.LOAD_MANIFEST()
        .then((entries) => {
          const latestRelease = String(entries?.[0]?.release || '').trim()
          if (!latestRelease) {
            throw new Error('manifest.yaml is missing the latest release')
          }
          this.latestKnownVersion = latestRelease
          return latestRelease
        })
        .catch((error) => {
          this.latestVersionLoadError = error.message
          throw error
        })
    },

    async LOAD_MANIFEST() {
      if (Array.isArray(this.manifestEntries) && this.manifestEntries.length > 0) {
        return this.manifestEntries
      }

      return fetch(getPathWithBase('/atlas-data/dist/manifest.yaml'))
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Unable to load manifest.yaml (${response.status})`)
          }
          return response.text()
        })
        .then((text) => {
          if (looksLikeHtml(text)) {
            throw new Error('manifest.yaml was not found (received HTML fallback)')
          }
          const parsed = yaml.load(text)
          if (!Array.isArray(parsed)) {
            throw new Error('manifest.yaml has invalid format')
          }
          this.manifestEntries = parsed
          return parsed
        })
    },

    resolveManifestYamlPath(releaseVersion) {
      const manifestVersion = String(releaseVersion || '').trim()
      const entries = Array.isArray(this.manifestEntries) ? this.manifestEntries : []

      let manifestEntry = null
      if (manifestVersion) {
        manifestEntry = entries.find(
          (entry) => String(entry?.release || '').trim() === manifestVersion
        )
      } else {
        const pinned = String(ATLAS_DATA_VERSION || '').trim()
        if (pinned) {
          manifestEntry = entries.find((entry) => String(entry?.release || '').trim() === pinned)
        }
        if (!manifestEntry) {
          manifestEntry = entries[0] || null
        }
      }

      if (!manifestEntry) {
        return null
      }

      const versions = Array.isArray(manifestEntry.versions) ? manifestEntry.versions : []
      const v6Entry = versions.find((versionEntry) =>
        String(versionEntry?.path || '')
          .trim()
          .startsWith('v6/')
      )
      const path = String(v6Entry?.path || '').trim()
      if (!path) {
        return null
      }

      return {
        release: String(manifestEntry.release || '').trim(),
        path: `/atlas-data/dist/${path}`,
      }
    },

    // Convert all date strings in a JS object to JavaScript Date objects
    convertDatesToJS(data) {
      // The following field names are expected by the website to be dates
      const dateFieldNames = ['created-date', 'modified-date', 'date']

      // Recursively look for the specified fields to cast their values as Dates
      if (Array.isArray(data)) {
        return data.map((item) => this.convertDatesToJS(item))
      } else if (typeof data === 'object' && data !== null) {
        const newData = {}
        for (const key in data) {
          if (dateFieldNames.includes(key)) {
            newData[key] = new Date(data[key])
          } else {
            newData[key] = this.convertDatesToJS(data[key])
          }
        }
        return newData
      }
      return data // Return primitive types or null
    },

    /**
     * Helper function to fetch YAML file
     */
    async fetchYaml(version) {
      return this.LOAD_MANIFEST()
        .then(() => {
          const resolved = this.resolveManifestYamlPath(version)
          if (!resolved?.path) {
            const requestedVersion = version || ATLAS_DATA_VERSION || 'latest'
            throw new Error(`No v6 manifest entry found for version "${requestedVersion}"`)
          }

          return {
            yamlPath: resolved.path,
            requestedVersion: resolved.release || version || ATLAS_DATA_VERSION || 'latest',
          }
        })
        .then(({ yamlPath, requestedVersion }) =>
          fetch(getPathWithBase(yamlPath)).then((response) => {
            if (!response.ok) {
              throw new Error(
                `Unable to load ATLAS YAML for version "${requestedVersion}" (${response.status})`
              )
            }
            return response.text()
          })
        )
        .then((text) => {
          if (looksLikeHtml(text)) {
            const requestedVersion = version || ATLAS_DATA_VERSION || 'latest'
            throw new Error(
              `ATLAS YAML for version "${requestedVersion}" was not found (received HTML fallback)`
            )
          }

          const parsed = yaml.load(text)
          if (!isValidAtlasData(parsed)) {
            const requestedVersion = version || ATLAS_DATA_VERSION || 'latest'
            throw new Error(`ATLAS YAML for version "${requestedVersion}" has invalid format`)
          }

          return parsed
        })
    },

    /**
     * Fetches ATLAS data either from API or YAML file
     */
    async fetchData(version) {
      // Fetch from the API if its URL exists
      if (isApiMode()) {
        const resolvedVersion = version || ATLAS_DATA_VERSION
        const isVersionedRoute = Boolean(version)
        return Promise.resolve()
          .then(() => {
            if (!resolvedVersion) {
              assertApiModeVersionConfigured()
            }
            return fetch(`/api/versions/${encodeURIComponent(resolvedVersion)}/data`)
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `There was an issue with fetching from the API. Error: ${response.status}`
              )
            }
            const contentType = response.headers.get('content-type') || ''
            if (contentType.includes('json')) {
              return response.json()
            }

            return response.text().then((text) => yaml.load(text))
          })
          .then((data) => {
            if (!isValidAtlasData(data)) {
              throw new Error('ATLAS API response has invalid format')
            }
            return this.convertDatesToJS(data)
          })
          .catch((error) => {
            if (isVersionedRoute) {
              throw new Error(
                `Unable to load ATLAS data for version "${version}" from API: ${error.message}`
              )
            }
            console.warn(error)
            console.warn('Loading site using ATLAS.yaml instead')
            return this.fetchYaml(version)
          })

        // Fetch from the files if there is no API URL or if the API fetch failed
      } else {
        return this.fetchYaml(version)
      }
    },

    /**
     * Takes ATLAS JSON data and properly processes and sets it in the store
     */
    processData(data, version) {
      this.relatedObjectsCache = {}

      const matrix = data.matrix
      const matrixId = matrix.id
      const objectTypePluralValues = new Set([
        'tactics',
        'techniques',
        'mitigations',
        'case-studies',
      ])

      const tactics = Object.values(data.tactics || {})
      const techniques = Object.values(data.techniques || {})
      const mitigations = Object.values(data.mitigations || {})
      const caseStudies = Object.values(data['case-studies'] || {})

      const objectsById = {}
      const allDataObjects = tactics.concat(techniques, mitigations, caseStudies)
      allDataObjects.forEach((obj) => {
        obj.route = dataObjectToRoute(obj, version)
        objectsById[obj.id] = obj
      })

      const relationships = data.relationships || {}
      const relationshipIndex = {
        outgoingBySourceId: {},
        incomingByTargetId: {},
      }

      // Build mappings from relationship graph
      techniques.forEach((technique) => {
        technique.tactics = []
      })

      Object.entries(relationships).forEach(([sourceId, rels]) => {
        relationshipIndex.outgoingBySourceId[sourceId] = rels
        Object.values(rels).forEach((relsByType) => {
          relsByType.forEach((rel) => {
            if (!relationshipIndex.incomingByTargetId[rel.target]) {
              relationshipIndex.incomingByTargetId[rel.target] = []
            }
            relationshipIndex.incomingByTargetId[rel.target].push(rel)
          })
        })

        if (rels.achieves) {
          rels.achieves.forEach((rel) => {
            if (objectsById[sourceId] && objectsById[sourceId]['object-type'] === 'technique') {
              objectsById[sourceId].tactics.push(rel.target)
            }
          })
        }

        if (rels.specializes && rels.specializes.length > 0 && objectsById[sourceId]) {
          objectsById[sourceId]['subtechnique-of'] = rels.specializes[0].target
        }

        if (rels.mitigates && objectsById[sourceId]) {
          objectsById[sourceId].mitigates = rels.mitigates.map((rel) => ({
            technique: rel.target,
            description: rel.description || '',
          }))
        }

        if (rels.employs && objectsById[sourceId]) {
          const steps = rels.employs
            .map((rel, index) => ({
              step: rel['step-id'] || `S${String(index).padStart(2, '0')}`,
              leadsTo: rel['leads-to'] || [],
              tactic: rel.tactic,
              technique: rel.target,
              description: rel.description || '',
            }))
            .sort((a, b) => a.step.localeCompare(b.step))
            .map(({ tactic, technique, description }) => ({ tactic, technique, description }))

          objectsById[sourceId].attack_chain = steps
          objectsById[sourceId].columnNames = ['description']
        }
      })

      const parentTechniques = techniques.filter(
        (t) => Array.isArray(t.tactics) && t.tactics.length > 0 && !('subtechnique-of' in t)
      )
      const subtechniques = techniques.filter((t) => 'subtechnique-of' in t)

      const toTechniqueLink = (technique) => ({
        id: technique.id,
        'object-type': technique['object-type'],
        name: technique.name,
        description: technique.description,
        route: technique.route,
        label: technique.label,
        maturity: technique.maturity,
        platforms: technique.platforms || [],
        ...('attack-reference' in technique
          ? { 'attack-reference': technique['attack-reference'] }
          : {}),
      })

      techniques.forEach((technique) => {
        if ('subtechnique-of' in technique) {
          const parent = objectsById[technique['subtechnique-of']]
          technique.label = parent ? `${parent.name}: ${technique.name}` : technique.name
        } else {
          technique.label = technique.name
        }
      })

      const subtechniquesByParentId = subtechniques.reduce((acc, subtechnique) => {
        const parentId = subtechnique['subtechnique-of']
        if (!acc[parentId]) {
          acc[parentId] = []
        }
        acc[parentId].push(toTechniqueLink(subtechnique))
        return acc
      }, {})

      parentTechniques.forEach((parentTechnique) => {
        const specializedTechniques = subtechniquesByParentId[parentTechnique.id] || []
        if (specializedTechniques.length > 0) {
          parentTechnique.subtechniques = specializedTechniques
        } else {
          delete parentTechnique.subtechniques
        }
      })

      const parentTechniquesByTacticId = parentTechniques.reduce((acc, technique) => {
        technique.tactics.forEach((tacticId) => {
          if (!acc[tacticId]) {
            acc[tacticId] = []
          }
          acc[tacticId].push(technique)
        })
        return acc
      }, {})

      const tacticsForMatrix = tactics.map((tactic) => {
        const associated = parentTechniquesByTacticId[tactic.id] || []
        tactic.techniques = associated.map((technique) => ({
          ...toTechniqueLink(technique),
          subtechniques: technique.subtechniques || [],
        }))
        tactic.techniques = tactic.techniques.sort((a, b) => (a.name < b.name ? -1 : 1))
        return tactic
      })

      const sequenceRels = relationships[matrixId]?.sequences || []
      const tacticSortOrder = new Map(sequenceRels.map((rel, index) => [rel.target, index]))
      tacticsForMatrix.sort((a, b) => {
        const ai = tacticSortOrder.has(a.id) ? tacticSortOrder.get(a.id) : Number.MAX_SAFE_INTEGER
        const bi = tacticSortOrder.has(b.id) ? tacticSortOrder.get(b.id) : Number.MAX_SAFE_INTEGER
        return ai - bi
      })

      const result = {
        id: data.collection.id,
        name: data.collection.name,
        version: data.collection.version,
        matrices: [
          {
            ...matrix,
            route: version
              ? `/v/${encodeURIComponent(version)}/matrices/${matrix.id}`
              : `/matrices/${matrix.id}`,
          },
        ],
        objects: {
          tactics: { [matrixId]: tacticsForMatrix },
          techniques: { [matrixId]: techniques },
          mitigations: { [matrixId]: mitigations },
          'case-studies': caseStudies,
        },
        objectsById,
        relationshipIndex,
        allDataObjects,
      }

      this.SET_OBJECT_TYPE_PLURAL_VALUES(Array.from(objectTypePluralValues))

      const categoryValues = collectUniqueArrayValues(allDataObjects, 'categories')
      const mlLifecycleValues = collectUniqueArrayValues(allDataObjects, 'lifecycle-phases')
      this.SET_CATEGORY_VALUES(categoryValues)
      this.SET_ML_LIFECYCLE_VALUES(mlLifecycleValues)
      this.SET_ATLAS_DATA(result)
    },

    /**
     * Loads in ATLAS data. Automatically called upon start
     */
    async loadData(version = '') {
      this.dataLoadError = ''

      try {
        // Retrieve the threat matrix JSON data, then process and populate store upon start
        await this.fetchData(version).then((jsonData) => {
          if (!isValidAtlasData(jsonData)) {
            throw new Error('ATLAS data payload is invalid')
          }
          this.processData(jsonData, version)
        })
      } catch (error) {
        const requestedVersion = version || 'latest'
        this.dataLoadError = `Unable to load ATLAS data for version "${requestedVersion}": ${error.message}`
        throw error
      }
    },
  },
})
