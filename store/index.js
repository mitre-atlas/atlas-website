/* eslint-disable */
const fs = require('fs').promises
const yaml = require('js-yaml')
import {
  dataObjectToPluralTitle,
  dataObjectToRoute
} from '@/assets/dataHelpers.js'

export const state = () => ({
  data: {},
  doShowNavDrawer: false,
  navDrawerItems: [],
  navDrawerTitle: 'Placeholder Title',
})

// Keys that will not be considered as properties or references to other data objects
const DEFAULT_DATA_OBJECT_KEYS = [
  'id',
  'object-type',
  'name',
  'description'
]

export const EXTRA_ADDED_WEBSITE_KEYS = [
  'route',
  'label'
]

const deepCopyDefault = (obj, extraKeys) => {
  // Creates a deep copy of the provided data object, limited to defined keys
  // Used to provide a reference object for linking
  let keysToKeep = DEFAULT_DATA_OBJECT_KEYS + EXTRA_ADDED_WEBSITE_KEYS
  if (typeof extraKeys !== 'undefined') {
    // Add specified keys if present
    keysToKeep = keysToKeep + extraKeys
  }
  return JSON.parse(JSON.stringify(obj, keysToKeep))
}

export const getters = {
  getDataAttribute: state => key => state.data[key],

  // Get a single array of all objects
  getDataObjects: state => state.data.allDataObjects,

  getDataObjectsByType: state => (objType, matrixId, returnObject) => {
    // Returns a list of data objects under the provided object type
    // or an empty Array if not found
    // Ex. in rendering the studies page when there is no case-studies key in the data
    const content = state.data.objects[objType]

    if (typeof returnObject !== 'undefined' && returnObject) {
      // Return the object with keys of matrix ID and values of data objects
      return content
    }

    if (typeof matrixId === 'undefined') {
      // This is a top-level key containing an array of data objects
      if (Array.isArray(content)) {
        return content
      }
      // Otherwise this is an object keyed by matrix ID,
      // and the ID is is not specified
      // Return the all matrices' objects of this type
      return Object.values(content).flat()
    }
    // Otherwise access the matrix's objects by ID
    return content[matrixId] ?? []
  },

  getDataObjectsByTypeKeyValue:
    (_, getters) => (objType, key, value, matrixId) => {
      // Retrieves a list of data objects
      const objs = getters.getDataObjectsByType(objType, matrixId)
      // Return the first data object whose key-value matches the provided value argument
      return objs.filter(obj => obj[key] === value)
    },

  getDataObjectsByTypeKeyValueDeepCopyDefault:
    (_, getters) => (objType, key, value, matrixId) => {
      // Retrieves a deep copy of a list of data objects, keeping only default data keys
      let objs = getters.getDataObjectsByTypeKeyValue(
        objType,
        key,
        value,
        matrixId
      )
      // Deep copy only the default data keys, i.e. id, name, route for linking
      objs = objs.map(obj => deepCopyDefault(obj))
      return objs
    },

  getDataObjectsByTypeKeyContainingValue:
    (_, getters) => (objType, key, value, matrixId) => {
      // Retrieves a list of data objects
      const objs = getters.getDataObjectsByType(objType, matrixId)
      // Return the data objects whose key includes the provided value argument
      return objs.filter(obj => key in obj && obj[key].includes(value))
    },

  getReferencedDataObjects: (_, getters) => argObj => {
    // Returns an object with key/object-type to array of objects referenced by this object

    // Get object keys that may be references, i.e. are not default
    const dataKeys = Object.keys(argObj).filter(value => {
      // Handle tactics having techniques attached, or techniques having subtechniques attached,
      // from the matrix hierarchy building in nuxtServerInit, as the link already exists in the opposite direction
      if (
        (argObj['object-type'] === 'tactic' && value === 'techniques') ||
        (argObj['object-type'] === 'technique' && value === 'subtechniques')
      ) {
        return false
      }
      // Returns true if this key value should be considered a possible ID reference or property
      return !(DEFAULT_DATA_OBJECT_KEYS + EXTRA_ADDED_WEBSITE_KEYS).includes(value)
    })

    // IDs of objects directly referenced by this page's object
    const referencedObjects = {}
    dataKeys.forEach(key => {
      const value = argObj[key]
      if (Array.isArray(value)) {
        referencedObjects[key] = value
          .map(id => getters.getDataObjectByIdDeepCopyDefault(id))
          .flat()
      } else {
        // Single object referenced by ID
        const refObj = getters.getDataObjectByIdDeepCopyDefault(value)
        if (refObj) {
          // Create a single-element Array
          referencedObjects[key] = [refObj]
        } else if (typeof value === 'string' && /[^\s]/.test(value)) {
          // Add the key and value as-is, representing a declared property, if the value is a non-empty string and not just for website use
          referencedObjects[key] = value
        }
      }
    })

    // Handle subtechnique-of title
    if ('subtechnique-of' in referencedObjects) {
      // Access parent technique object from the array under the `subtechnique-of` key
      const parentTechniqueId = referencedObjects['subtechnique-of'][0]['id']
      // Access full object, including the tactics key
      const parentTechnique = getters.getDataObjectById(parentTechniqueId)

      // Add the parent technique's tactic(s) to the subtechnique's related objects
      referencedObjects['tactics'] = parentTechnique.tactics.map(id =>
        getters.getDataObjectByIdDeepCopyDefault(id)
      )

      // Re-key the parent technique object under the desired display label,
      // which expects an array
      referencedObjects['parent-technique'] = [parentTechnique]
      // Remove the re-labeled key-value pair
      delete referencedObjects['subtechnique-of']
    }

    return referencedObjects
  },

  getDataObjectsReferencing: (state, getters) => argObj => {
    // Return an object with key/object-type to array of deep-copied objects that reference this object

    const id = argObj.id

    // Find objects that reference this object's ID
    let objects = getters.getDataObjects.filter(obj => {
      return obj.id !== id && Object.values(obj).flat().includes(id)
    })
    // Make a deep copy of each object, with only default keys, i.e. id, name, route for linking
    objects = objects.map(obj => deepCopyDefault(obj))

    // Other subtechniques
    if (argObj['object-type'] === 'technique' && 'subtechnique-of' in argObj) {
      const parentTechniqueId = id.substring(0, id.lastIndexOf('.'))
      const otherSubtechniques =
        getters.getDataObjectsByTypeKeyValueDeepCopyDefault(
          'techniques',
          'subtechnique-of',
          parentTechniqueId
        )
      // Add other subtechniques that aren't this one
      objects = objects.concat(otherSubtechniques.filter(t => t.id !== id))
    }

    // Add subtechniques of tactics to the technique list
    if (argObj['object-type'] === 'tactic') {
      let subtechniques = []
      objects.forEach(obj => {
        if (obj['object-type'] === 'technique') {
          subtechniques = subtechniques.concat(
            getters.getDataObjectsByTypeKeyValueDeepCopyDefault(
              'techniques',
              'subtechnique-of',
              obj.id
            )
          )
        }
      })
      objects = objects.concat(subtechniques)
    }

    // Look for case studies, if any, with the singular key in its procedure, i.e. technique or tactic
    if (
      'case-studies' in state.data.objects &&
      (argObj['object-type'] === 'tactic' ||
        argObj['object-type'] === 'technique')
    ) {
      let studies = getters.getDataObjectsByType('case-studies').filter(study =>
        study.procedure
          // singular key, i.e. technique vs. techniques
          .some(step => step[argObj['object-type']] === id)
      )
      // Make a deep copy of the array
      studies = JSON.parse(JSON.stringify(studies))

      objects = objects.concat(studies)
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
      if (
        argObj['object-type'] === 'technique' &&
        'subtechnique-of' in argObj
      ) {
        subtechniqueKey = 'other subtechniques'
      }
      // Relabel the techniques found
      results[subtechniqueKey] = results['technique']
      delete results['technique']
    }

    // Adding ATT&CK object to relatedObjects for DataSidebar rendering
    if ('ATT&CK-reference' in argObj) {
      results['ATT&CK-reference'] = argObj['ATT&CK-reference']
    }

    return results
  },

  getRelatedDataObjects: (_, getters) => argObj => {
    // Returns an object of key/object-type to array of data objects related to this object
    return {
      ...getters.getReferencedDataObjects(argObj),
      ...getters.getDataObjectsReferencing(argObj)
    }
  },

  getDataObjectById: (_, getters) => value => {
    // Returns the data object with the corresponding ID
    return getters.getDataObjects.find(obj => obj['id'] === value)
  },

  getDataObjectByIdDeepCopyDefault: (_, getters) => value => {
    // Returns a deep copy of the the data object with the corresponding ID, with only default data keys present
    let obj = getters.getDataObjectById(value)
    if (obj) {
      obj = deepCopyDefault(obj)
    }
    // Deep copy, only keeping default keys, i.e. id, name, route, for linking
    return obj
  },

  getFirstMatrixId: state => {
    return state.data.matrices[0].id
  },

  getMatrixIds: state => {
    return state.data.matrices.map(obj => obj.id)
  },

  getMatrixByID: state => value => {
    return state.data.matrices.find(obj => obj['id'] === value)
  }
}

export const mutations = {
  SET_ATLAS_DATA(state, payload) {
    state.data = { ...state.data, ...payload }
  },
  TOGGLE_NAV_DRAWER(state, status) {
    if (typeof status === 'undefined') {
      // Toggle state
      state.doShowNavDrawer = !state.doShowNavDrawer
    } else if (typeof status === 'boolean') {
      // Set state
      state.doShowNavDrawer = status
    }
  },
  SET_NAV_DRAWER_ITEMS(state, items) {
    if (Array.isArray(items) && items.length > 0 && 'object-type' in items[0]) {
      // Payload is an array of data objects
      state.navDrawerItems = [...items]
      // Plural object type with spaces instead of dashes, if any
      state.navDrawerTitle = dataObjectToPluralTitle(items[0])
    } else if (
      typeof items === 'object' &&
      items !== null &&
      'data' in items &&
      'title' in items
    ) {
      // Payload is an object { data, title }
      state.navDrawerItems = [...items.data]
      state.navDrawerTitle = items.title
    } else {
      console.error('Unexpected payload for SET_NAV_DRAWER_ITEMS', items)
    }
  }
}

export const actions = {
  // Note that this function is called for every dynamic route generated via nuxt generate
  // TODO Caching, also needs return or await
  async nuxtServerInit({ commit }, { store }) {
    // Retrieve the threat matrix YAML data and populate store upon start
    const getAtlasData = await fs.readFile(
      'static/atlas-data/dist/ATLAS.yaml',
      'utf-8'
    )

    // Get all contents, then parse and commit payload
    const promise = Promise.resolve(getAtlasData).then(contents => {
      // Parse YAML
      const data = yaml.load(contents)

      // Collect top-level data objects under the key 'objects'
      const { id, name, version, matrices, ...objects } = data
      const result = { id, name, version, matrices, objects }

      // Hold on to all data objects, in a list-of-lists
      // Starting with the top-level objects
      let allDataObjects = Object.values(objects).flat()

      // Add the route to each top-level object
      allDataObjects.forEach(dataObj => {
        // Add a property for each data object's internal route
        dataObj.route = dataObjectToRoute(dataObj)
      })

      // Build matrix-like structure under each data object type
      matrices.forEach((matrix, i) => {
        // Collect data objects within each matrix
        const { id, name, ...matrix_objs } = matrix

        let allMatrixObjs = Object.values(matrix_objs).flat()
        // Add the route to each matrix object
        allMatrixObjs.forEach(dataObj => {
          // Add a property for each data object's internal route
          dataObj.route = dataObjectToRoute(dataObj)

          // Add label field
          if (dataObj['object-type'] === 'technique') {
            if ('subtechnique-of' in dataObj) {
              const parentName = matrix_objs.techniques.find(
                p => p['id'] === dataObj['subtechnique-of']
              ).name
              dataObj.label = `${parentName}: ${dataObj.name}`
            } else {
              dataObj.label = dataObj.name
            }
          }
        })

        // Create a populated tree of tactics > techniques > subtechniques in the current data

        // Split techniques into top-level parents, and subtechniques; add labels
        const parentTechniques = matrix_objs.techniques.filter(
          t => 'tactics' in t
        )
        const subtechniques = matrix_objs.techniques.filter(
          t => 'subtechnique-of' in t
        )

        // Add subtechniques to top-level techniques
        const populatedTechniques = parentTechniques.map(t => {
          // Check if any subtechniques reference this technique
          if (subtechniques.some(s => s['subtechnique-of'] === t.id)) {
            // Add associated subtechniques to this technique, deep-copying and limited to default keys for linking
            const associatedObjs = subtechniques.filter(
              s => s['subtechnique-of'] === t.id
            )
            t.subtechniques = associatedObjs.map(obj => deepCopyDefault(obj))
          }
          return t
        })

        // Add techniques to tactics
        matrix_objs.tactics.map(t => {
          // Add techniques that reference this tactic, , deep-copying and limited to default keys for linking, as well as the subtechniques link
          const associatedObjs = populatedTechniques.filter(pt =>
            pt.tactics.includes(t.id)
          )
          t.techniques = associatedObjs.map(obj =>
            deepCopyDefault(obj, ['subtechniques'])
          )
          return t
        })

        // Iterate over objects and add them to the result
        for (const [key, dataObjs] of Object.entries(matrix_objs)) {
          // Add objects from this matrix into the result
          if (key in objects) {
            // Add to the existing object keyed by the matrix ID
            objects[key][id] = dataObjs
          } else {
            // Otherwise initialize it
            objects[key] = {
              [id]: dataObjs
            }
          }

          // Collect each matrix's objects for later operations
          allDataObjects = allDataObjects.concat(dataObjs)

          // Remove this key and values from the result's matrix,
          // to reduce data duplciationg. Leaving ID and name
          delete result.matrices[i][key]
          result.matrices[i]['route'] = `/matrices/${id}`
        }
      })

      // Add all data objects to the store to facilitate finding by ID
      result.allDataObjects = allDataObjects

      // Commit data to the store, in preparation for using getters below
      commit('SET_ATLAS_DATA', result)

      // Link each data object to related objects
      allDataObjects.forEach(dataObj => {
        // Add a property for the data object's internal route
        dataObj.route = dataObjectToRoute(dataObj)

        // Apply to all objects but case studies, which have their own template
        if (dataObj['object-type'] != 'case-study') {
          // Add a property with other data objects referenced by this one or that reference this one
          dataObj.relatedObjects = store.getters.getRelatedDataObjects(dataObj)
        }
      })

      // Commit the fully populated data
      commit('SET_ATLAS_DATA', result)
    })

    return promise
  }
}
