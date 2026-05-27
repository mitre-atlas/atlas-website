<template>
  <div>
    <PageSectionTitle pageTitle="ATLAS Versions" />
    <p class="mb-4">Available ATLAS releases with website snapshots, release notes, and source YAML files.</p>

    <v-alert v-if="errorMessage" type="warning" variant="tonal" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <div class="d-flex flex-wrap ga-3 mb-4">
      <v-chip color="primary" prepend-icon="mdi-tag">Current release: v{{ latestRelease || 'N/A' }}</v-chip>
      <v-chip color="secondary" prepend-icon="mdi-history">Total releases: {{ versionRows.length }}</v-chip>
      <v-chip v-if="latestLegacy" color="blue-grey" prepend-icon="mdi-archive">Latest legacy: {{ latestLegacy }}</v-chip>
    </div>

    <v-alert v-if="versionRows.length === 0" type="info" variant="tonal" class="mb-4">
      No releases are available.
    </v-alert>

    <v-table v-if="mdAndUp && versionRows.length > 0" density="comfortable" class="release-table">
      <thead>
        <tr>
          <th>Version</th>
          <th>Published</th>
          <th>Release Notes</th>
          <th>Website</th>
          <th>YAML</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in versionRows" :key="entry.version">
          <td>
            <span class="font-weight-bold">v{{ entry.version }}</span>
            <v-chip
              v-if="entry.legacyVersion"
              size="x-small"
              color="blue-grey"
              variant="tonal"
              class="ml-2"
            >
              v{{ entry.legacyVersion }}
            </v-chip>
          </td>
          <td>{{ entry.releaseDate }}</td>
          <td>
            <a v-if="entry.releaseNotesUrl" :href="entry.releaseNotesUrl">Release Notes</a>
            <span v-else class="text-medium-emphasis">-</span>
          </td>
          <td>
            <a :href="entry.websiteUrl">/v/{{ entry.version }}</a>
          </td>
          <td>
            <a v-if="entry.yamlUrl" :href="entry.yamlUrl" target="_blank" rel="noreferrer">
              {{ entry.yamlName }}
            </a>
            <span v-else class="text-medium-emphasis">-</span>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div v-else-if="versionRows.length > 0" class="d-flex flex-column ga-3">
      <v-card v-for="entry in versionRows" :key="entry.version" variant="outlined">
        <v-card-item>
          <div class="d-flex align-center flex-wrap ga-2 mb-2">
            <div class="text-h6 font-weight-bold">v{{ entry.version }}</div>
            <v-chip
              v-if="entry.legacyVersion"
              size="x-small"
              color="blue-grey"
              variant="tonal"
            >
              legacy {{ entry.legacyVersion }}
            </v-chip>
          </div>
          <div class="text-body-2 mb-3">Published {{ entry.releaseDate }}</div>
          <div class="d-flex flex-wrap ga-2">
            <v-btn
              v-if="entry.releaseNotesUrl"
              :href="entry.releaseNotesUrl"
              size="small"
              variant="tonal"
              color="primary"
            >
              Release Notes
            </v-btn>
            <v-btn :href="entry.websiteUrl" size="small" variant="tonal" color="secondary">
              Website
            </v-btn>
            <v-btn
              v-if="entry.yamlUrl"
              :href="entry.yamlUrl"
              size="small"
              variant="tonal"
              color="blue-grey"
              target="_blank"
              rel="noreferrer"
            >
              YAML
            </v-btn>
          </div>
        </v-card-item>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import jsyaml from 'js-yaml'
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import PageSectionTitle from '@/components/PageSectionTitle.vue'
import { getPathWithBase } from '@/assets/tools.js'
import { ATLAS_DATA_GITHUB_URL } from '@/config/env'

const { mdAndUp } = useDisplay()

const errorMessage = ref('')
const releases = ref([])

const updateModules = import.meta.glob('@/../public/content/update-files/*.md')
const availableUpdateDates = new Set(
  Object.keys(updateModules)
    .map((filepath) => {
      const match = filepath.match(/(\d{4}-\d{2})\.md$/)
      return match ? match[1] : ''
    })
    .filter(Boolean)
)

function formatReleaseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const raw = String(value ?? '').trim()
  if (!raw) {
    return ''
  }

  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return raw
}

const versionRows = computed(() => {
  return [...releases.value]
    .filter((entry) => entry?.release && entry?.['release-date'])
    .map((entry) => {
      const version = String(entry.release).trim()
      const releaseDateRaw = String(entry['release-date'] || '').trim()
      const releaseDate = formatReleaseDate(releaseDateRaw)
      const encodedVersion = encodeURIComponent(version)
      const versionEntries = Array.isArray(entry.versions) ? entry.versions : []
      const v6Entry = versionEntries.find((v) => String(v?.path || '').startsWith('v6/'))
      const legacyEntry = versionEntries.find((v) => String(v?.path || '').startsWith('legacy/'))
      const yamlPath = String(v6Entry?.path || '').trim()
      const yamlName = yamlPath.split('/').pop() || ''
      const releaseNotesLabel = releaseDateRaw.slice(0, 7)
      const hasReleaseNotesDate = /^\d{4}-\d{2}$/.test(releaseNotesLabel)
      const hasReleaseNotes = hasReleaseNotesDate && availableUpdateDates.has(releaseNotesLabel)

      return {
        version,
        releaseDateRaw,
        releaseDate,
        legacyVersion: String(legacyEntry?.['format-version'] || '').trim(),
        releaseNotesLabel,
        releaseNotesUrl: hasReleaseNotes
          ? getPathWithBase(`/resources/updates/${releaseNotesLabel}`)
          : '',
        websiteUrl: getPathWithBase(`/v/${encodedVersion}`),
        yamlUrl: yamlPath ? `${ATLAS_DATA_GITHUB_URL}/blob/main/dist/${yamlPath}` : '',
        yamlName
      }
    })
    .sort((a, b) =>
    a.releaseDateRaw < b.releaseDateRaw ? 1 : a.releaseDateRaw > b.releaseDateRaw ? -1 : 0
  )
})

const latestRow = computed(() => {
  const ordered = [...versionRows.value].sort((a, b) =>
    a.releaseDateRaw < b.releaseDateRaw ? 1 : a.releaseDateRaw > b.releaseDateRaw ? -1 : 0
  )
  return ordered[0] || null
})

const latestRelease = computed(() => latestRow.value?.version || '')
const latestLegacy = computed(() => latestRow.value?.legacyVersion || '')

fetch(getPathWithBase('/atlas-data/dist/manifest.yaml'))
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load manifest file (${response.status})`)
    }
    return response.text()
  })
  .then((content) => {
    const parsed = jsyaml.load(content)
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid manifest file format')
    }
    releases.value = parsed
  })
  .catch((error) => {
    errorMessage.value = 'Unable to load ATLAS versions right now. Please try again later.'
    console.error('Error loading ATLAS versions:', error)
  })
</script>
