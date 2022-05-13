export const getters = {
  getParent: (state, getters, rootState, rootGetters) => (subtechnique) => {
    if ('subtechnique-of' in subtechnique) {
      const parentTechniqueId = subtechnique['subtechnique-of']
      return rootGetters.getDataObjectById(parentTechniqueId)
    }
    return null
  }
}
