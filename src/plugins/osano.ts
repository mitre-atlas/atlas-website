import { OSANO_SCRIPT, hasOsano } from '@/config/env'

export async function insertOsano() {
  // Check for existence of the Osano cookie env var
  if (hasOsano()) {
    // Create a script element with the script URL
    const script = document.createElement('script')
    script.src = OSANO_SCRIPT

    // Append the script element to the document's head
    document.head.appendChild(script)
  }
}
