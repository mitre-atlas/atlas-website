import contributionSchemaUrl from '/atlas-data/dist/schemas/atlas_contribution_schema.json?url'
import caseStudySchemaUrl from '/atlas-data/dist/schemas/atlas_website_case_study_schema.json?url'

async function loadSchema(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Unable to load schema from ${url}: ${response.status}`)
  }
  return response.json()
}

export const contributionSchema = await loadSchema(contributionSchemaUrl)
export const caseStudySchema = await loadSchema(caseStudySchemaUrl)
