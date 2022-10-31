export function clearStatus (status) {
  status.message = ''
  return status
}

// Sets messages for the alert component
export function setErrorStatus (status, message = 'Please address any errors above') {
  status.type = 'error'
  status.color = 'error'
  status.message = message
  return status
}

export function setWarningStatus (status, message) {
  status.type = 'warning'
  status.color = 'warning'
  status.message = message
  return status
}

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
