function readEnvValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export const MITRE_TITLE = readEnvValue(import.meta.env.VITE_MITRE_TITLE)
export const SHORT_NAME = readEnvValue(import.meta.env.VITE_SHORT_NAME)
export const NAVIGATOR_URL = readEnvValue(import.meta.env.VITE_NAVIGATOR_URL)
export const KNOWLEDGE_GRAPH_URL = readEnvValue(import.meta.env.VITE_KNOWLEDGE_GRAPH_URL)
export const CONTACT_EMAIL = readEnvValue(import.meta.env.VITE_CONTACT_EMAIL)
export const SUBMISSION_EMAIL = readEnvValue(import.meta.env.VITE_SUBMISSION_EMAIL)
export const ANALYTICS_ID = readEnvValue(import.meta.env.VITE_ANALYTICS_ID)
export const OSANO_SCRIPT = readEnvValue(import.meta.env.VITE_OSANO_SCRIPT)
export const API_URL = readEnvValue(import.meta.env.VITE_API_URL)
export const ATLAS_DATA_VERSION = readEnvValue(import.meta.env.VITE_ATLAS_DATA_VERSION)
export const NAVIGATOR_LAYER_URL = readEnvValue(import.meta.env.VITE_NAVIGATOR_LAYER_URL)
export const ATLAS_DATA_GITHUB_URL =
  readEnvValue(import.meta.env.VITE_ATLAS_DATA_GITHUB_URL) ||
  'https://github.com/mitre-atlas/atlas-data'

export function hasAnalytics(): boolean {
  return ANALYTICS_ID.length > 0
}

export function hasOsano(): boolean {
  return OSANO_SCRIPT.length > 0
}

export function isApiMode(): boolean {
  return API_URL.length > 0
}

export function assertApiModeVersionConfigured(): void {
  if (isApiMode() && !ATLAS_DATA_VERSION) {
    throw new Error('VITE_ATLAS_DATA_VERSION must be set when VITE_API_URL is configured')
  }
}
