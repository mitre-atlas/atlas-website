<template>
  <div>
    <page-section-title>
      {{ title }}
    </page-section-title>

    <v-list
      two-line
      subheader
    >
      <div
        v-for="(repos, repoCategory) in repositories"
        :key="repoCategory"
      >
        <v-subheader class="text-capitalize">
          {{ repoCategory }}
        </v-subheader>
        <v-list-item
          v-for="repo in repos"
          :key="repo.name"
          :href="repo.url"
          target="_blank"
        >
          <v-list-item-content>
            <v-list-item-title v-html="repo.name" />
            <v-list-item-subtitle v-html="$md.render(repo.description)" />
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>
<script>
export default {
  name: 'GitHubRepos',
  data: () => ({
    title: 'ATLAS GitHub Repositories',
    repositories: {
      websites: [
        {
          name: 'ATLAS Website',
          description: 'Static files for this atlas.mitre.org website.',
          url: 'https://github.com/mitre/advmlthreatmatrix/tree/gh-pages'
        },
        {
          name: 'ATLAS Navigator',
          description: 'Static files for the ATLAS Navigator - a fork of the MITRE ATT&CK&reg; Navigator.',
          url: 'https://github.com/mitre-atlas/attack-navigator'
        }
      ],
      data: [
        {
          name: 'ATLAS Data',
          description: 'Source data for ATLAS tactics, techniques, and case studies, along with scripts and documentation.',
          url: 'https://github.com/mitre-atlas/atlas-data'
        },
        {
          name: 'ATLAS Navigator Data',
          description: 'Scripts and outputs for ATLAS data in STIX JSON and ATT&CK Navigator layer formats.',
          url: 'https://github.com/mitre-atlas/atlas-navigator-data'
        }
      ],
      tools: [
        {
          name: 'Almanac',
          description: '[CALDERA](https://caldera.mitre.org/) adversary emulation platform plugin for exploring ATLAS using the ATLAS Navigator - a fork of the ATT&CK [Compass](https://caldera.readthedocs.io/en/latest/Plugin-library.html#compass) plugin.',
          url: 'https://github.com/mitre-atlas/almanac'
        }
      ]
    }
  })
}
</script>
