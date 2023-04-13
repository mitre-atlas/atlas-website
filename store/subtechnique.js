/**
 * Submodule store's getters
 * @alias subtechnique-getters
 */
export const getters = {
  /**
   * Retrieve the parent object of this subtechnique, if any.
   *
   * @param {object} subtechnique - A subtechnique data object
   * @returns {object|null} The subtechnique's parent object, or null
   * @alias mapGetters: subtechnique/getParent
   */
  getParent: (state, getters, rootState, rootGetters) => (subtechnique) => {
    if ('subtechnique-of' in subtechnique) {
      const parentTechniqueId = subtechnique['subtechnique-of']
      return rootGetters.getDataObjectById(parentTechniqueId)
    }
    return null
  },

  /**
   * Construct a display name for subtechniques of "parent name: subtechnique name"
   *
   * @param {string} id - A subtechnique ID
   * @returns {string} The expanded subtechnique name, or empty string if not a subtechnique
   * @alias mapGetters: subtechnique/getParentName
   */
  getParentName: (state, getters, rootState, rootGetters) => (id) => {
    const techniqueObj = rootGetters.getDataObjectById(id)
    if ('subtechnique-of' in techniqueObj) {
      const parentObj = rootGetters.getDataObjectById(techniqueObj['subtechnique-of'])
      return parentObj.name + ': '
    }
    return ''
  }
}
