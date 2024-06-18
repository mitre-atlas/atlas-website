export async function insertOsano() {
  // Check for existence of the Osano cookie env var
  if (import.meta.env.VITE_OSANO_SCRIPT) {
    // Create a script element with the script URL
    const script = document.createElement('script')
    script.src = import.meta.env.VITE_OSANO_SCRIPT

    // Append the script element to the document's head
    document.head.appendChild(script)
  }
}
