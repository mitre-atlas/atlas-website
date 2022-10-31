export const getters = {
  getParent: (state, getters, rootState, rootGetters) => (subtechnique) => {
    if ('subtechnique-of' in subtechnique) {
      const parentTechniqueId = subtechnique['subtechnique-of']
      return rootGetters.getDataObjectById(parentTechniqueId)
    }
    return null
  },

  getParentName: (state, getters, rootState, rootGetters) => (id) => {
    const techniqueObj = rootGetters.getDataObjectById(id)
    if ('subtechnique-of' in techniqueObj) {
      const parentObj = rootGetters.getDataObjectById(techniqueObj['subtechnique-of'])
      return parentObj.name + ': '
    }
    return ''
  }
}
