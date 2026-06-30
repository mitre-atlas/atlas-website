<template>
  <div>
    <PageSectionTitle :pageTitle="title" />
    <p class="text-h5 my-5">Current {{ SHORT_NAME }} Version</p>
    <v-chip
      variant="flat"
      prepend-icon="mdi-code-tags"
      label
      color="blue"
      :text="`Website v${version}`"
      class="mr-3"
    />
    <v-chip
      variant="flat"
      prepend-icon="mdi-database"
      label
      color="primary"
      :text="`Data v${artifactVersion || 'N/A'}`"
    />
    <v-list-item
      :title="getLatestUpdateDate()"
      subtitle="View details and prior versions on the Updates page"
      class="mt-5"
      to="/resources/updates"
    />
    <v-list-item
      title="ATLAS Versions"
      subtitle="Browse available release versions and data files"
      to="/resources/versions"
    />
    <p class="text-h5 mt-10">Accessing ATLAS Data</p>
    <div class="px-4">
      <v-list lines="two" v-model:opened="open">
        <div v-for="item in items" :key="item.title">
          <v-list-item
            v-if="item.type === 'link'"
            :title="item.title"
            :subtitle="item.subtitle"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
          ></v-list-item>

          <v-list-group :value="item.groupValue" v-if="item.type === 'group'">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :title="item.title" :subtitle="item.subtitle" />
            </template>
            <v-list v-for="(subitem, i) in item.subitems" :key="i">
              <v-list-item v-if="subitem.type === 'subHeader'" class="text-grey">
                <div v-html="subitem.subHeader" />
              </v-list-item>
              <v-list-item v-if="subitem.type === 'link'" class="ml-10">
                <a :href="subitem.url" :download="subitem.downloadName || true">
                  {{
                    subitem.displayName || subitem.url.substring(subitem.url.lastIndexOf('/') + 1)
                  }}
                </a>
              </v-list-item>
            </v-list>
          </v-list-group>
        </div>
      </v-list>
    </div>

    <p class="text-h5 mt-10">ATLAS GitHub Repositories</p>

    <v-list lines="two">
      <div v-for="(repos, repoCategory) in repositories" :key="repoCategory">
        <div class="text-capitalize">
          {{ repoCategory }}
        </div>
        <v-list-item
          v-for="repo in repos"
          :key="repo.name"
          :title="repo.name"
          :href="repo.url"
          target="_blank"
        >
          <v-list-item-subtitle>
            <div v-html="md.render(repo.description)" />
          </v-list-item-subtitle>
        </v-list-item>
      </div>
    </v-list>

    <p class="text-h5 mt-10">Other ATLAS Resources</p>

    <v-list lines="two">
      <div v-for="site in otherSites" :key="site.name">
        <v-list-item :title="site.name" :href="site.url" target="_blank" rel="noreferrer">
          <v-list-item-subtitle>
            <div v-html="md.render(site.description)" />
          </v-list-item-subtitle>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>

<script setup>
import { ATLAS_DATA_GITHUB_URL, SHORT_NAME } from '@/config/env'
import PageSectionTitle from '@//components/PageSectionTitle.vue'
import { ref, inject, computed } from 'vue'
import { version } from '/package.json'
import { useMain } from '@/stores/main'
import { constructReleaseArtifactUrl, getLatestUpdateDate } from '@/assets/tools.js'

const title = ref('General Information')

const md = inject('markdownit')
const mainStore = useMain()
const artifactVersion = computed(() => {
  return String(mainStore.getCanonicalLatestVersion || '').trim()
})

function releaseAssetUrl(filename) {
  return constructReleaseArtifactUrl(filename, artifactVersion.value)
}

const open = ref(['excelGroup'])

const items = computed(() => [
  {
    type: 'link',
    title: 'As YAML',
    subtitle: 'Source data files for editing and parsing',
    url: ATLAS_DATA_GITHUB_URL,
  },
  {
    type: 'group',
    groupValue: 'stixGroup',
    title: 'As STIX',
    subtitle: 'STIX 2.1 (.json) files, either ATLAS standalone or ATLAS + ATT&CK Enterprise',
    subitems: [
      {
        type: 'link',
        url: releaseAssetUrl('stix-atlas.json'),
        displayName: 'stix-atlas.json',
        downloadName: 'stix-atlas.json',
      },
      {
        type: 'link',
        url: releaseAssetUrl('stix-atlas-attack-enterprise.json'),
        displayName: 'stix-atlas-attack-enterprise.json',
        downloadName: 'stix-atlas-attack-enterprise.json',
      },
    ],
  },
  {
    type: 'group',
    groupValue: 'excelGroup',
    title: 'As Excel',
    subtitle: 'Excel (.xslx) files, built from the ATLAS STIX data using ATT&CK tools',
    subitems: [
      {
        type: 'subHeader',
        subHeader:
          'Click on a file below to download.' +
          '<a href="https://github.com/mitre-atlas/atlas-navigator-data#export-to-excel" target="_blank">' +
          '&nbsp;See this README for more information.</a>',
      },
      {
        type: 'link',
        url: releaseAssetUrl('excel-atlas-matrices.xlsx'),
        displayName: 'atlas-matrices.xlsx',
        downloadName: 'atlas-matrices.xlsx',
      },
      {
        type: 'link',
        url: releaseAssetUrl('excel-atlas-mitigations.xlsx'),
        displayName: 'atlas-mitigations.xlsx',
        downloadName: 'atlas-mitigations.xlsx',
      },
      {
        type: 'link',
        url: releaseAssetUrl('excel-atlas-tactics.xlsx'),
        displayName: 'atlas-tactics.xlsx',
        downloadName: 'atlas-tactics.xlsx',
      },
      {
        type: 'link',
        url: releaseAssetUrl('excel-atlas-techniques.xlsx'),
        displayName: 'atlas-techniques.xlsx',
        downloadName: 'atlas-techniques.xlsx',
      },
      {
        type: 'link',
        url: releaseAssetUrl('excel-atlas.xlsx'),
        displayName: 'atlas.xlsx',
        downloadName: 'atlas.xlsx',
      },
    ],
  },
])

const repositories = {
  websites: [
    {
      name: 'ATLAS Website',
      description: 'Static files for this atlas.mitre.org website.',
      url: 'https://github.com/mitre-atlas/atlas-website',
    },
    {
      name: 'ATLAS Navigator',
      description: 'ATLAS Navigator web app - a fork of the MITRE ATT&CK&reg; Navigator.',
      url: 'https://github.com/mitre-atlas/atlas-navigator/tree/atlas',
    },
  ],
  data: [
    {
      name: 'ATLAS Data',
      description:
        'Source data for ATLAS tactics, techniques, and case studies, along with scripts and documentation.',
      url: ATLAS_DATA_GITHUB_URL,
    },
    {
      name: 'ATLAS Navigator Data',
      description:
        'Scripts and outputs for ATLAS data in STIX JSON and ATT&CK Navigator layer formats.',
      url: 'https://github.com/mitre-atlas/atlas-navigator-data',
    },
  ],
  tools: [
    {
      name: 'Almanac',
      description:
        '[CALDERA](https://caldera.mitre.org/) adversary emulation platform plugin for exploring ATLAS using the ATLAS Navigator - a fork of the ATT&CK [Compass](https://caldera.readthedocs.io/en/latest/Plugin-library.html#compass) plugin.',
      url: 'https://github.com/mitre-atlas/almanac',
    },
    {
      name: 'Arsenal',
      description:
        'The Arsenal plugin will help store and create adversarial TTPs defined in ATLAS to interface with [CALDERA](https://caldera.mitre.org/). ',
      url: 'https://github.com/mitre-atlas/arsenal',
    },
  ],
}

const otherSites = [
  {
    name: 'AI Incident Sharing',
    description: 'Submit & received anonymized community AI incident data',
    url: 'https://ai-incidents.mitre.org',
  },
  {
    name: 'AI Risk Database',
    description: 'Explore AI supply chain risk with the AI Risk Database',
    url: 'https://ai-risk.mitre.org',
  },
]
</script>
