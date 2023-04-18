<template>
  <div>
    <div>
      <page-title>{{ title }}</page-title>
      <div class="mb-5 tw-prose tw-max-w-none">
        <p>
          Attacks on machine learning (ML) systems are being developed and
          released with increased regularity. Attacks have historically been
          performed in controlled settings, but attacks are increasingly
          observed on production systems. Deployed ML systems can have many
          vulnerabilities, for example trained on personally identifiable
          information, trusted to make critical decisions with little oversight,
          and have little to no logging and alerting attached to their use.
        </p>
        <p>
          {{ $config.name.mitre }} case studies are selected because of the
          impact to production ML systems. Each demonstrates one of the
          following characteristics:
        </p>
        <ol>
          <li>
            Range of Attacks: Evasion, poisoning, model replication and
            exploiting traditional software flaws.
          </li>
          <li>
            Range of Personas: Average user, security researchers, ML
            researchers and fully-equipped Red team.
          </li>
          <li>
            Range of ML Paradigms: Attacks on MLaaS, ML models hosted on cloud,
            hosted on-premise, ML models on edge.
          </li>
          <li>
            Range of Use Case: Attacks on ML systems used in both
            "security-sensitive" applications like cybersecurity and
            non-security-sensitive applications like chatbots.
          </li>
        </ol>
      </div>

      <div class="mb-10">
        {{ description }}
      </div>

      <info-table :items="getStudies" :options="options" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
/**
 * @name studies/index
 *
 * Explore case studies page search table
 */
export default {
  layout: 'side-nav',
  data: ({ $config: { name } }) => ({
    title: 'Case Studies',
    description: 'Browse the list of case studies below.',
    options: {
      sortBy: ['id'],
      sortDesc: [true]
    }
  }),
  head () {
    return {
      title: `${this.title} List | ${this.$config.name.mitre}`
    }
  },
  computed: {
    // Get studies from store to populate info table
    getStudies () {
      return this.$store.getters.getDataObjectsByType('case-studies')
    }
  },
  mounted () {
    this.setNavItems(this.$store.getters.getDataObjectsByType('case-studies'))
  },
  methods: {
    ...mapMutations({ setNavItems: 'SET_NAV_DRAWER_ITEMS' })
  }
}
</script>
