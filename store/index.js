const fs = require('fs').promises
const yaml = require('js-yaml')

export const state = () => ({
  data: {
    // Represents the threat matrix data
    tactics: [],
    techniques: [],
    studies: []
  }
})

export const getters = {
  // Simple getters
  getTactics: (state) => {
    return state.data.tactics
  },
  getTechniques: (state) => {
    return state.data.techniques
  },

  // Find by ID (exact match)
  getTacticById: state => (id) => {
    return state.data.tactics.find(t => t.id === id)
  },
  getTechniqueById: state => (id) => {
    return state.data.techniques.find(t => t.id === id)
  },

  // Find by ID (short ID by potentially fully-qualified ID)
  getTacticWhereIdIn: state => (id) => {
    return state.data.tactics.find(t => id.includes(t.id))
  },
  getTechniqueWhereIdIn: state => (id) => {
    return state.data.techniques.find(t => id.includes(t.id))
  },

  // Find techniques with potentially fully-qualified tactic ID references
  // by short ID
  getTechniquesByTacticId: state => (tacticId) => {
    return state.data.techniques.filter((t) => {
      // Returns true when at least 1 of the referenced tactic matches the query
      return t.tactics.some(fullTacticId => fullTacticId.includes(tacticId))
    })
  }
}

export const mutations = {
  SET_THREAT_MATRIX_DATA (state, payload) {
    state.data = { ...state.data, ...payload }
  }
}

export const actions = {

  // Note that this function is called for every dynamic route generated via nuxt generate
  // TODO Caching, also needs return or await
  async nuxtServerInit ({ commit }, { req }) {
    // Retrieve the threat matrix YAML data and populate store upon start
    const getTactics = await fs.readFile('static/data/tactics.yaml', 'utf-8')
    const getTechniques = await fs.readFile('static/data/techniques.yaml', 'utf-8')
    const getCaseStudies = await fs.readFile('static/data/case-studies.yaml', 'utf-8')

    // Get all contents, then parse and commit payload
    const promise = Promise.all([getTactics, getTechniques, getCaseStudies])
      .then((contents) => {
        const [tactics, techniques, studies] = contents.map(yaml.load)

        // Create an object with keys named the same as these vars
        const payload = { tactics, techniques, studies }

        commit('SET_THREAT_MATRIX_DATA', payload)
      })

    return promise
  }
}
