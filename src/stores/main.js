import { defineStore } from 'pinia'

import yaml from 'js-yaml'

import { dataObjectToPluralTitle, dataObjectToRoute } from '@/assets/dataHelpers.js'
import { getPathWithBase } from '@/assets/tools'

/**
 * Keys that will not be considered as properties or references to other data objects
 * @type {string[]}
 */
const DEFAULT_DATA_OBJECT_KEYS = ['id', 'object-type', 'name', 'description']


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
  let keysToKeep = DEFAULT_DATA_OBJECT_KEYS + EXTRA_ADDED_WEBSITE_KEYS
  if (typeof extraKeys !== 'undefined') {
    // Add specified keys if present
    keysToKeep = keysToKeep + extraKeys
  }
  return JSON.parse(JSON.stringify(obj, keysToKeep))
}

export const useMain = defineStore('main', {
  state: () => ({
    /**
     * ATLAS Data as read from ATLAS.yaml
     * @type {Object}
     * @alias state: data
     */
    data: {},
    /**
     * Whether to show the navigation drawer on pages
     * @type {boolean}
     * @alias state: doShowNavDrawer
     */
    doShowNavDrawer: true,
    /**
     * Items that populate the navigation drawer
     * @type {object|object[]} items - An object { title: string, data: data objects } specifying the navigation drawer title, or an array of data objects whose title is inferred from the type
     * @alias state: navDrawerItems
     */
    navDrawerItems: [],
    /**
     * Title for the navigation drawer
     * @type {String}
     * @alias state: navDrawerTitle
     */
    navDrawerTitle: 'Placeholder Title',
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
    pageNotFoundDisplaying: false
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
    getDataObjects: (state) => state.data.allDataObjects,

    /**
     * Get array containing the names of all the object types
     * @returns {string[]}
     */
    getDataObjectTypes: (state) => Object.keys(state.data.objects),

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
    getDataObjectsByTypeKeyValue: function (state) {
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
    getDataObjectsByTypeKeyValueDeepCopyDefault: function (state) {
      return function (objType, key, value, matrixId) {
        // Retrieves a deep copy of a list of data objects, keeping only default data keys
        let objs = this.getDataObjectsByTypeKeyValue(objType, key, value, matrixId)
        // Deep copy only the default data keys, i.e. id, name, route for linking
        objs = objs.map((obj) => deepCopyDefault(obj))
        return objs
      }
    },

    /**
     * Retrieves an array of data objects of a specific type, optionally that belong to a specific matrix,
     * that contain the specified value in the array under the given key.
     *
     * @param {string} objType - Value of the data object's `object-type` field
     * @param {string} key - Data object key field with which to match
     * @param {string} value - Value of the data object key field with which to match
     * @param {string} [matrixId] - The key for the matrix under the `matrices` ATLAS Data object
     * @returns {object[]} Array of data objects matching the parameters
     * @alias mapGetters: getDataObjectsByTypeKeyContainingValue
     */
    getDataObjectsByTypeKeyContainingValue: function (state) {
      return function (objType, key, value, matrixId) {
        // Retrieves a list of data objects
        const objs = this.getDataObjectsByType(objType, matrixId)
        // Return the data objects whose key includes the provided value argument
        return objs.filter((obj) => key in obj && obj[key].includes(value))
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
     * @alias mapGetters: getDataObjectsByTypeKeyContainingValue
     */

    getDataObjectsFilteredbyNestedKeyValue: function (state) {
    return function (objType, key, nested_key, values, matrixId) {
    const objs = this.getDataObjectsByType(objType, matrixId)
    return objs
      .filter(obj => key in obj)
      .map(obj => {
        // Clone the object and filter the array under 'key'
        const newObj = { ...obj };
        newObj[key] = obj[key].filter(item => values.includes(item[nested_key]));
        return newObj;
      })
      .filter(obj => obj[key].length > 0) // Only keep objects with matches
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
        // Returns an object with key/object-type to array of objects referenced by this object

        // Get object keys that may be references, i.e. are not default
        const dataKeys = Object.keys(argObj).filter((value) => {
          // Handle tactics having techniques attached, or techniques having subtechniques attached,
          // from the matrix hierarchy building in nuxtServerInit, as the link already exists in the opposite direction
          if (
            (argObj['object-type'] === 'tactic' && value === 'techniques') ||
            (argObj['object-type'] === 'technique' && value === 'subtechniques') ||
            // A technique's tactics will be found by the referencing side
            // Also to avoid rendering array of tactics as tags
            (argObj['object-type'] === 'technique' && value === 'tactics')
          ) {
            return false
          }
          // Returns true if this key value should be considered a possible ID reference or property
          return !(DEFAULT_DATA_OBJECT_KEYS + EXTRA_ADDED_WEBSITE_KEYS).includes(value)
        })

        // IDs of objects directly referenced by this page's object
        const referencedObjects = {}
        dataKeys.forEach((key) => {
          const value = argObj[key]
          // Note that array of data object IDs are handled by getDataObjectsReferencing
          if (Array.isArray(value) && typeof value[0] === 'object' && 'id' in value[0]) {
            // List of data objects for tabular format

            // Pull out the list of field names other than 'id' to be column names
            let columnNames = Object.keys(value[0])
            columnNames = columnNames.filter((name) => name !== 'id')

            // Flatten into an array of data objects augmented with tabular data and column names
            const objs = value
              .map((v) => {
                // Get data object by ID
                const obj = this.getDataObjectByIdDeepCopyDefault(v['id'])
                // Combine it with the tabular data
                const augmentedObj = Object.assign(obj, v)
                // Add the tabular data key names as column names
                augmentedObj['columnNames'] = columnNames
                return augmentedObj
              })
              .flat()

            // Assign to related objects
            referencedObjects[key] = objs
          } else {
            // Single object referenced by ID
            const refObj = this.getDataObjectByIdDeepCopyDefault(value)
            if (refObj) {
              // Create a single-element Array
              referencedObjects[key] = [refObj]
            } else if (
              // The value is a non-empty string, i.e. a declared property
              (typeof value === 'string' && /[^\s]/.test(value)) ||
              // The value is a string array, i.e. tags
              (Array.isArray(value) && value.every((v) => typeof v === 'string'))
            ) {
              // Add the key and value as-is
              referencedObjects[key] = value
            }
          }
        })

        // Handle subtechnique-of title
        if ('subtechnique-of' in referencedObjects) {
          // Access parent technique object from the array under the `subtechnique-of` key
          const parentTechniqueId = referencedObjects['subtechnique-of'][0]['id']
          // Access full object, including the tactics key
          const parentTechnique = this.getDataObjectById(parentTechniqueId)

          // Add the parent technique's tactic(s) to the subtechnique's related objects
          referencedObjects['tactics'] = parentTechnique.tactics.map((id) =>
            this.getDataObjectByIdDeepCopyDefault(id)
          )

          // Re-key the parent technique object under the desired display label,
          // which expects an array
          referencedObjects['parent-technique'] = [parentTechnique]
          // Remove the re-labeled key-value pair
          delete referencedObjects['subtechnique-of']
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
        // Return an object with key/object-type to array of deep-copied objects that reference this object

        const id = argObj.id

        // Find objects that reference this object's ID
        let objects = this.getDataObjects.filter((obj) => {
          // Disregard the argObj itself
          if (obj.id === id) {
            return false
          }
          // Otherwise examine the object's values
          // Can be primitives or arrays of objects
          const objValues = Object.values(obj).flat()
          // Take
          const isRef = objValues.some((val) => {
            if (typeof val === 'string') {
              // argObj ID is referenced directly or in a nested array
              // ex. tactic ID in a technique's tactics array
              return val === id
            } else if (typeof val === 'object') {
              // argObj ID is referenced in a nested object
              // ex. procedure step technique, or a mitigation technique use id
              return Object.values(val).includes(id)
            } else {
              // This is not a reference to an object ID
              return false
            }
          })
          return isRef
        })
        // Make a deep copy of each object, with only default keys, i.e. id, name, route for linking
        objects = objects.map((obj) => deepCopyDefault(obj))

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

        // Adding ATT&CK object to relatedObjects for DataSidebar rendering
        if ('ATT&CK-reference' in argObj) {
          results['ATT&CK-reference'] = argObj['ATT&CK-reference']
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
        // Returns an object of key/object-type to array of data objects related to this object
        const relatedObjs = {
          ...this.getReferencedDataObjects(argObj),
          ...this.getDataObjectsReferencing(argObj)
        }

        // Sort object keys in alphabetical order for display
        return Object.keys(relatedObjs)
          .sort()
          .reduce((acc, key) => {
            acc[key] = relatedObjs[key]
            return acc
          }, {})
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
        // Returns the data object with the corresponding ID
        if (this.getDataObjects) return this.getDataObjects.find((obj) => obj['id'] === value)
      }
    },

    /**
     * Retrieve a data object by ID, deep-copying the object with only default keys present
     * @param {string} value - Data object ID
     * @returns {object} Matching data object
     */
    getDataObjectByIdDeepCopyDefault: function (state) {
      return function (value) {
        // Returns a deep copy of the the data object with the corresponding ID, with only default data keys present
        let obj = this.getDataObjectById(value)
        // Deep copy, only keeping default keys, i.e. id, name, route, for linking
        if (obj) {
          obj = deepCopyDefault(obj)
        }
        return obj
      }
    },

    /**
     * Retrieves the ID of the first matrix
     * @returns {string} matrix ID
     * @alias mapGetters: getFirstMatrixId
     */
    getFirstMatrixId: (state) => {
      return state.data.matrices[0].id
    },

    /**
     * Retrieves an array of matrix IDs
     * @returns {string[]} matrix IDs
     */
    getMatrixIds: (state) => {
      return state.data.matrices.map((obj) => obj.id)
    },

    /**
     * Retrieve a matrix object by ID
     * @param {string} value - Matrix ID
     * @returns {object} Matching matrix object containing keys to data object arrays
     * @alias mapGetters: getMatrixByID
     */
    getMatrixByID: (state) => (value) => {
      return state.data.matrices.find((obj) => obj['id'] === value)
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
    getParent: function (state) {
      return function (subtechnique) {
        if ('subtechnique-of' in subtechnique) {
          const parentTechniqueId = subtechnique['subtechnique-of']
          return this.getDataObjectById(parentTechniqueId)
        }
        return null
      }
    }
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
     * Sets the navigation drawer items
     * @param {object|object[]} items - An object { title: string, data: data objects } specifying the navigation drawer title, or an array of data objects whose title is inferred from the type
     * @alias mapMutations: SET_NAV_DRAWER_ITEMS
     */
    SET_NAV_DRAWER_ITEMS(items) {
      if (Array.isArray(items) && items.length > 0 && 'object-type' in items[0]) {
        // Payload is an array of data objects
        this.navDrawerItems = [...items]
        // Plural object type with spaces instead of dashes, if any
        this.navDrawerTitle = dataObjectToPluralTitle(items[0])
      } else if (
        typeof items === 'object' &&
        items !== null &&
        'data' in items &&
        'title' in items
      ) {
        // Payload is an object { data, title }
        this.navDrawerItems = [...items.data]
        this.navDrawerTitle = items.title
      } else {
        console.error('Unexpected payload for SET_NAV_DRAWER_ITEMS', items)
      }
    },
    /**
     * Disables the visiblity of the annoucement banner
     * @alias mapMutations: DISMISS_ANNOUCEMENT_BANNER
     */
    DISMISS_ANNOUCEMENT_BANNER(state) {
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


  // Convert all date strings in a JS object to JavaScript Date objects
  convertDatesToJS(data) {
    // The following field names are expected by the website to be dates
    const dateFieldNames = [
      'created_date',
      'modified_date',
      'incident-date'
    ]

    // Recursively look for the specified fields to cast their values as Dates
    if (Array.isArray(data)) {
      return data.map(item => this.convertDatesToJS(item));
    } else if (typeof data === 'object' && data !== null) {
      const newData = {}
      for (const key in data) {
        if (dateFieldNames.includes(key)) {
          newData[key] = new Date(data[key])
        } else {
          newData[key] = this.convertDatesToJS(data[key]);
        }
      }
      return newData
    }
    return data // Return primitive types or null
  },

    /**
     * Helper function to fetch YAML file
     */
    async fetchYaml() {
      return fetch(getPathWithBase('/atlas-data/dist/ATLAS.yaml'))
        .then((response) => response.text())
        .then((text) => yaml.load(text))
    },

    /**
     * Fetches ATLAS data either from API or YAML file
     */
    async fetchData() {

      // Fetch from the API if its URL exists 
      if (import.meta.env.VITE_API_URL) {
        return fetch('/api/atlas-yaml/json')
          .then((response) => {
            if (!response.ok) {
              throw new Error(`There was an issue with fetching from the API. Error: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            return this.convertDatesToJS(data)
          })
          .catch((error) => {
            console.log(error);
            console.log("Loading site using ATLAS.yaml instead");
            return this.fetchYaml();
          });

      // Fetch from the files if there is no API URL or if the API fetch failed
      } else {
        return this.fetchYaml();
      }
    },
    

    /**
     * Takes ATLAS JSON data and properly processes and sets it in the store
     */
    processData(data) {

      // Collect top-level data objects under the key 'objects'
      const { id, name, version, matrices, ...objects } = data
      const result = { id, name, version, matrices, objects }

      // Hold on to all data objects, in a list-of-lists
      // Starting with the top-level objects
      let allDataObjects = Object.values(objects).flat()

      // Add the route to each top-level object
      allDataObjects.forEach((dataObj) => {
        // Add a property for each data object's internal route
        dataObj.route = dataObjectToRoute(dataObj)
        if ('object-type' in dataObj && dataObj['object-type'] == 'case-study') {
          dataObj.columnNames = ['summary']
        }
      })

      // Pluralized last word of object-type values, which serve as route names
      const objectTypePluralValues = new Set()

      // Build matrix-like structure under each data object type
      matrices.forEach((matrix, i) => {
        // Collect data objects within each matrix
        const { id, name, ...matrix_objs } = matrix

        let allMatrixObjs = Object.values(matrix_objs).flat()
        // Add the route to each matrix object
        allMatrixObjs.forEach((dataObj) => {
          // Add a property for each data object's internal route
          dataObj.route = dataObjectToRoute(dataObj)

          // Add label field
          if (dataObj['object-type'] === 'technique') {
            if ('subtechnique-of' in dataObj) {
              const parentName = matrix_objs.techniques.find(
                (p) => p['id'] === dataObj['subtechnique-of']
              ).name
              dataObj.label = `${parentName}: ${dataObj.name}`
            } else {
              dataObj.label = dataObj.name
            }
          }
        })

        // Create a populated tree of tactics > techniques > subtechniques in the current data

        // Split techniques into top-level parents, and subtechniques; add labels
        const parentTechniques = matrix_objs.techniques.filter((t) => 'tactics' in t)
        const subtechniques = matrix_objs.techniques.filter((t) => 'subtechnique-of' in t)

        // Add subtechniques to top-level techniques
        const populatedTechniques = parentTechniques.map((t) => {
          // Check if any subtechniques reference this technique
          if (subtechniques.some((s) => s['subtechnique-of'] === t.id)) {
            // Add associated subtechniques to this technique, deep-copying and limited to default keys for linking
            const associatedObjs = subtechniques.filter((s) => s['subtechnique-of'] === t.id)
            t.subtechniques = associatedObjs.map((obj) => deepCopyDefault(obj))
          }
          return t
        })

        // Add techniques to tactics
        matrix_objs.tactics.map((t) => {
          // Add techniques that reference this tactic, , deep-copying and limited to default keys for linking, as well as the subtechniques link
          const associatedObjs = populatedTechniques.filter((pt) => pt.tactics.includes(t.id))
          t.techniques = associatedObjs.map((obj) => deepCopyDefault(obj, ['subtechniques']))
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

            // Add to the list of accepted _objectTypeValues
            const objectTypePlural = dataObjectToPluralTitle(key, true)
            objectTypePluralValues.add(objectTypePlural)
          }

          // Collect each matrix's objects for later operations
          allDataObjects = allDataObjects.concat(dataObjs)

          // Remove this key and values from the result's matrix,
          // to reduce data duplciationg. Leaving ID and name
          delete result.matrices[i][key]
          result.matrices[i]['route'] = `/matrices/${id}`
        }
      })

      // Commit the array of accepted _objectTypePlural values
      this.SET_OBJECT_TYPE_PLURAL_VALUES(Array.from(objectTypePluralValues))

      // Add all data objects to the store to facilitate finding by ID
      result.allDataObjects = allDataObjects

      // Commit data to the store, in preparation for using getters below
      this.SET_ATLAS_DATA(result)

      // Link each data object to related objects
      allDataObjects.forEach((dataObj) => {
        // Add a property for the data object's internal route
        dataObj.route = dataObjectToRoute(dataObj)

        // Apply to all objects but case studies, which have their own template
        if (dataObj['object-type'] != 'case-study') {
          // Add a property with other data objects referenced by this one or that reference this one
          dataObj.relatedObjects = this.getRelatedDataObjects(dataObj)
        }
      })

      // Commit the fully populated data
      this.SET_ATLAS_DATA(result)
    },

    /**
     * Loads in ATLAS data. Automatically called upon start
     */
    async loadData() {
      // Retrieve the threat matrix JSON data, then process and populate store upon start
      await this.fetchData().then((jsonData) => this.processData(jsonData))

    }

  }
})
