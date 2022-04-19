/* eslint-disable */
const fs = require('fs').promises
const path = require('path')
const yaml = require('js-yaml')

export const state = () => ({
  data: {
    // Represents the input threat matrix data
    tactics: [],
    techniques: [],
    techandsubtechniques: [],
    studies: [],
    // Represents the populated tactics, techniques, and subtechniques
    matrix: [],
    version: 0.0
  }
})

// defines the logic for all the "filtered" getters
const isFiltered = t => t.id.startsWith('AML')

export const getters = {
  // Simple getters
  getVersion: (state) => {
    return state.data.version
  },
  getTactics: (state) => {
    return state.data.tactics
  },
  getTrueFilteredTactics: (state) => { // the tactic has no att&ck techniques
    return state.data.tactics.filter(isFiltered)
  },
  getFilteredTactics: (state) => { // the tactic has atleast one atlas technique
    return state.data.tactics.filter((t) => {
      const isOfTactic = te => (('tactics') in te) && te.tactics.includes(t.id)
      const filteredTechniquesOfTactic = state.data.techniques.filter(isFiltered).filter(isOfTactic)
      return filteredTechniquesOfTactic.length > 0
    })
  },
  getTechniques: (state) => {
    return state.data.techniques
  },
  getFilteredTechniques: (state) => {
    return state.data.techniques.filter(isFiltered)
  },
  getStudies: (state) => {
    return state.data.studies
  },
  getMatrix: (state) => {
    return state.data.matrix
  },
  getTacticStyling: (state) => {
    return state.tacticStyling
  },

  // Find by ID (exact match)
  getTacticById: state => (id) => {
    return state.data.tactics.find(t => t.id === id)
  },
  getTechniqueById: state => (id) => {
    return state.data.techniques.find(t => t.id === id)
  },
  getStudyById: state => (id) => {
    return state.data.studies.find(s => s.id === id)
  },

  // Find by ID
  getStudiesWhereTacticIdIn: state => (id) => {
    return state.data.studies.filter((s) => {
      return s.procedure.some((p) => {
        return p.tactic === id
      })
    })
  },
  getStudiesWhereTechniqueIdIn: state => (id) => {
    return state.data.studies.filter((s) => {
      return s.procedure.some((p) => {
        return p.technique === id
      })
    })
  },

  // Find techniques with potentially fully-qualified tactic ID references
  // by short ID
  getTechniquesByTacticId: state => (tacticId) => {
    return state.data.techniques.filter((t) => {
      // This is a subtechnique, does not have tactics in AdvML
      if (!('tactics' in t)) {
        return false
      }
      // Returns true when at least 1 of the referenced tactic matches the query
      return t.tactics.includes(tacticId)
    })
  },

  getTechSubByTacticId: state => (tacticId) => {
    return state.data.techandsubtechniques.filter((t) => {
      return t.tactics.includes(tacticId)
    })
  },

  getFilteredTechniquesByTacticId: state => (tacticId) => {
    return state.data.techniques.filter(isFiltered).filter(t => ('tactics' in t) && t.tactics.includes(tacticId))
  }
}

export const mutations = {
  SET_THREAT_MATRIX_DATA (state, payload) {
    state.data = { ...state.data, ...payload }
  },
  SET_CASE_STUDY (state, inputCase) {
    state.caseStudy = inputCase
    console.log(state.caseStudy)
  }
}

export const actions = {
  submitCaseStudy ({ commit }, study) {
    commit('SET_CASE_STUDY', { study })
  },

  // Note that this function is called for every dynamic route generated via nuxt generate
  // TODO Caching, also needs return or await
  async nuxtServerInit ({ commit }, context) {
    // Retrieve the threat matrix YAML data and populate store upon start
    const getAtlasData = await fs.readFile('static/atlas-data/dist/ATLAS.yaml', 'utf-8')

    // Get all contents, then parse and commit payload
    const promise = Promise.resolve(getAtlasData)
      .then((contents) => {

       // Parse YAML
       const doc = yaml.load(contents)
       const studies = doc['case-studies']
       const techniques = doc['techniques']
       const tactics = doc['tactics']
       const version = doc['version']

        // Build out tactics and techniques used in the case studies
        // with which to filter the ATT&CK data
        const studyTactics = new Set()
        const studyTechniques = new Set()
        studies.forEach((study) => {
          study.procedure.forEach((p) => {
            studyTactics.add(p.tactic)
            studyTechniques.add(p.technique)
          })
        })

        // Build a populated version of the data, where tactics hold parent techniques
        // and parent techniques hold subtechniques

        // Split out subtechniques
        const parentTechniques = techniques.filter((technique) => {
          return !('subtechnique-of' in technique)
        })
        const subtechniques = techniques.filter((technique) => {
          return ('subtechnique-of' in technique)
        })

        // Populate parent techniques with subtechniques
        subtechniques.forEach((subtechnique) => {
          const parentTechniqueId = subtechnique['subtechnique-of']
          const parentTechniqueIndex = parentTechniques.findIndex(t => t.id === parentTechniqueId)
          const parentTechnique = parentTechniques[parentTechniqueIndex]

          // Associate subtechnique with the parent technique
          if ('subtechniques' in parentTechnique) {
            parentTechnique.subtechniques.push(subtechnique)
          } else {
            parentTechnique.subtechniques = [subtechnique]
          }
        })

        // Build AdvML-relevant techniques and tactics for matrix use
        const filteredTechniques = techniques.filter((technique) => {
          // studyTechniques.has(technique.id) // Use only techniques referenced in case studies
          return technique.id.startsWith('AML') // is an AdvML technique
          // return true // No filter
        })

        const tacticsIdsReferenced = new Set()
        filteredTechniques.forEach((technique) => {
          // This is a subtechnique, does not have tactics in AdvML
          if (!('tactics' in technique)) {
            return false
          }
          // Otherwise, collect distinct tactic IDs
          technique.tactics.forEach((tacticId) => {
            tacticsIdsReferenced.add(tacticId)
          })
        })

        const filteredTactics = tactics.filter((tactic) => {
          // return studyTactics.has(tactic.id) // Use only tactics referenced in case studies
          // return tactic.id.startsWith('AML') // is an AdvML tactic
          return tacticsIdsReferenced.has(tactic.id) // Only tactics referenced by the above techniques
          // return true // No filter
        })

        // Populate tactics with populated techniques
        const populatedTactics = filteredTactics.map((tactic) => {
          // Build up the top-level parent techniques
          const relevantFullTechniques = filteredTechniques.filter((technique) => {
            // Must be a parent-level technique that is under this tactic
            return !('subtechnique-of' in technique) && technique.tactics.includes(tactic.id)
          })

          tactic.techniques = relevantFullTechniques

          return tactic
        })

        const matrix = {
          tactics: populatedTactics
        }

        // Create an object with some keys named the same as these vars
        const payload = {
          tactics,
          techniques,
          techandsubtechniques: parentTechniques,
          studies,
          matrix,
          version
        }

        commit('SET_THREAT_MATRIX_DATA', payload)
      })

    return promise
  }
}
