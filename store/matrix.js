export const getters = {
  getMatrix: (state, getters, rootState, rootGetters) => {
    // Returns a populated tree of tactics > techniques > subtechniques
    // Used for Matrix population

    // Access data
    const techniques = rootGetters.getDataObjectsByType('techniques')
    const parentTechniques = techniques.filter(t => 'tactics' in t)
    const subtechniques = techniques.filter(t => 'subtechnique-of' in t)

    // Add subtechniques to techniques
    const populatedTechniques = parentTechniques.map((t) => {
      // Check if any subtechniques reference this technique
      if (subtechniques.some(s => s['subtechnique-of'] === t.id)) {
        // Add associated subtechniques to this technique
        t.subtechniques = subtechniques.filter(s => s['subtechnique-of'] === t.id)
      }
      return t
    })

    // Add techniques to tactics
    const tactics = rootGetters.getDataObjectsByType('tactics')
    const populatedTactics = tactics.map((t) => {
      // Add techniques that reference this tactic
      t.techniques = populatedTechniques.filter(pt => pt.tactics.includes(t.id))
      return t
    })

    return {
      tactics: populatedTactics
    }
  }
}
