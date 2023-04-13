/**
 * Helper methods for `pages/createstudy.vue` and its validation logic.
 * @module validation
 */

/**
 * Clears the message field of the provided status object.
 * @param {object} status
 * @returns {object} Status object
 */
export function clearStatus (status) {
  status.message = ''
  return status
}

/**
 * Sets messages for the alert component
 * @param {object} status
 * @param {string} [message='Please address any errors above']
 * @returns {object} Status object
 */
export function setErrorStatus (status, message = 'Please address any errors above') {
  status.type = 'error'
  status.color = 'error'
  status.message = message
  return status
}

/**
 * Sets the status object to a warning state with the provided message.
 * @param {object} status - Status object
 * @param {string} message - Message to be displayed to the user
 * @returns {object} Status object
 */
export function setWarningStatus (status, message) {
  status.type = 'warning'
  status.color = 'warning'
  status.message = message
  return status
}

/**
 * Sets the status object to a success state with the provided message.
 * @param {object} status - Status object
 * @param {boolean} submissionBool - Whether to reset the "user has downloaded a file" status
 * @param {string} message - Message to be displayed to the user
 * @returns {Array} Array of length 2 containing the status object and submission boolean
 */
export function setSuccessStatus (status, submissionBool, message) {
  status.type = 'success'
  status.color = 'success'
  status.message = message

  setTimeout(() => {
    // Reset status
    status.type = ''
    status.color = null
    status.message = ''
    // Reset download status
    submissionBool = false
  }, 3000)
  return [status, submissionBool]
}

const statusStyle = {
  warning: '#DAA520',
  error: '#FF5252'
}

/**
 * Returns header color based on status.
 * @param {object} status
 * @returns {string} String pair of color key and hex code value.
 */
export function statusStyleHeader (submissionStatus) {
  if (submissionStatus && 'type' in submissionStatus) {
    return 'color:' + statusStyle[submissionStatus.type]
  }
  return ''
}

/**
 * Returns card color based on status.
 * @param {object} status
 * @returns {object} object containing style info based on status.
 */
export function statusStyleCard (submissionStatus) {
  if (submissionStatus && 'type' in submissionStatus) {
    return {
      'border-color': statusStyle[submissionStatus.type],
      'border-width': '2px'
    }
  }
  return {}
}
