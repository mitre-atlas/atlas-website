const fs = require('fs').promises
const path = require('path')

export const state = () => ({
  data: {
    // Represents the input threat matrix data
    tactics: [],
    techniques: [],
    studies: [],
    // Represents the populated tactics, techniques, and subtechniques
    matrix: []
  },
  // Mapping of tactic names to v-icons
  tacticStyling: {
    'Model Evasion': {
      icon: 'mdi-eye-off',
      color: 'deep-purple'
    },
    Reconnaissance: {
      icon: 'mdi-account-search',
      color: 'green lighten-2'
    },
    'Resource Development': {
      icon: 'mdi-apps',
      color: 'green'
    },
    'Initial Access': {
      icon: 'mdi-door-open',
      color: 'light-green darken-2'
    },
    Execution: {
      icon: 'mdi-xml',
      color: 'lime darken-2'
    },
    Persistence: {
      icon: 'mdi-lock-open-plus',
      color: 'amber'
    },
    'Privilege Escalation': {
      icon: 'mdi-shield-account',
      color: 'orange'
    },
    'Defense Evasion': {
      icon: 'mdi-security',
      color: 'orange lighten-2'
    },
    'Credential Access': {
      icon: 'mdi-key',
      color: 'orange'
    },
    Discovery: {
      icon: 'mdi-cloud-search',
      color: 'orange darken-2'
    },
    'Lateral Movement': {
      icon: 'mdi-swap-horizontal-bold',
      color: 'deep-orange lighten-2'
    },
    Collection: {
      icon: 'mdi-file-multiple',
      color: 'deep-orange'
    },
    'Command and Control': {
      icon: 'mdi-lan-connect',
      color: 'red'
    },
    Exfiltration: {
      icon: 'mdi-package-down',
      color: 'red darken-2'
    },
    Impact: {
      icon: 'mdi-fire',
      color: 'red darken-4'
    }
  }
})

// defines the logic for all the "filtered" getters
const isFiltered = t => t.id.startsWith('AML')

export const getters = {
  // Simple getters
  getTactics: (state) => {
    return state.data.tactics
  },
  getTrueFilteredTactics: (state) => {
    return state.data.tactics.filter(isFiltered)
  },
  getFilteredTactics: (state) => {
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

  getFilteredTechniquesByTacticId: state => (tacticId) => {
    return state.data.techniques.filter(isFiltered).filter(t => ('tactics' in t) && t.tactics.includes(tacticId))
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
  async nuxtServerInit ({ commit }, context) {
    // Retrieve the threat matrix YAML data and populate store upon start
    const getTactics = await fs.readFile('static/data/tactics.json', 'utf-8')
    const getTechniques = await fs.readFile('static/data/techniques.json', 'utf-8')
    const getCaseStudies = await fs.readFile('static/data/case-studies.json', 'utf-8')

    // Get all contents, then parse and commit payload
    const promise = Promise.all([getTactics, getTechniques, getCaseStudies])
      .then((contents) => {
        // Pre-parse actions
        // Convert Markdown-style links, i.e. [name](full or relative URL)

        // Internal links start with / and are converted to nuxt-links
        // TODO nuxt-links do not resolve when using v-html, replacing with regular relative links
        const internalLinkRegex = /\[([^[]+?)\]\((\/.*?)\)/gm

        // Replace Markdown link syntax with HTML link for internal pages
        // [name](relPath), where relPath is /techniques/123, for example
        contents[1] = contents[1].replace(internalLinkRegex, (match, name, relPath) => {
          // Construct the href, taking into consideration the router base
          // Normalize to resolve possible //
          const fullPath = path.normalize(context.$config.router_base + relPath)
          // Construct the HTML link
          const link = "<a href='" + fullPath + "'>" + name + '</a>'
          return link
        })

        // External links start with http and are converted to HTML links
        const externalLinkRegex = /\[([^[]+?)\]\((http.*?)\)/gm
        contents[1] = contents[1].replace(externalLinkRegex, "<a href='$2'>$1</a>")

        // Convert any external links in the case studies as well
        contents[2] = contents[2].replace(externalLinkRegex, "<a href='$2'>$1</a>")

        // Parse JSON files
        const data = contents.map(JSON.parse)
        let { 1: techniques } = data
        const { 0: tactics, 2: studies } = data

        // Replace any (Citation: <source_name> ) text in ATT&CK data with citation links
        // using external references
        const citationRegex = /(\(Citation: (.*?)\))/gm
        techniques = techniques.map((technique) => {
          // Find citations
          let match = citationRegex.exec(technique.description)
          // Reference superscript numbering
          let refNum = 1

          while (match != null) {
            // 0 is whole match, 1 happens to also be the whole match, and 2 is the source name
            const citation = match[1]
            const sourceName = match[2]

            // Look up the corresponding URL from external references by source name
            const reference = technique.external_references.find((ef) => {
              if (ef.source_name === sourceName) {
                return true
              }
              return false
            })

            // Construct a superscript citation link
            const refSuperscriptLink = `<sup><a href='${reference.url}'>[${refNum}]</a></sup>`
            // Replace the entire citation text with the link
            technique.description = technique.description.replace(citation, refSuperscriptLink)

            // Move on to next match
            match = citationRegex.exec(technique.description)
            // Increment the reference for the next link
            refNum += 1
          }

          return technique
        })
        // contents[1] = contents[1].replace(citationRegex, "<a href='$2'>$1</a>")

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
          studies,
          matrix
        }

        commit('SET_THREAT_MATRIX_DATA', payload)
      })

    return promise
  }
}
