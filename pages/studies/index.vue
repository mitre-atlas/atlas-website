<template>
  <div>
    <breadcrumbs></breadcrumbs>
    <page-title>{{ title }}</page-title>
    <div class="mb-5">
      <p>
      Attacks on machine learning (ML) systems are being developed and released with increased regularity.
      Historically, attacks against ML systems have been performed in a controlled academic settings, but as these case studies demonstrate,
      attacks are being seen in the wild. In production settings ML systems are trained on personally identifiable information (PII),
      trusted to make critical decisions with little oversight, and have little to no logging and alerting attached to their use.
      The case studies were selected because of the impact to production ML systems, and each demonstrates one of the following characteristics:
      </p>
      <ol>
        <li class="mb-2">Range of Attacks: Evasion, poisoning, model replication and exploiting traditional software flaws.</li>
        <li class="mb-2">Range of Personas: Average user, security researchers, ML researchers and fully-equipped Red team.</li>
        <li class="mb-2">Range of ML Paradigms: Attacks on MLaaS, ML models hosted on cloud, hosted on-premise, ML models on edge.</li>
        <li class="mb-2">Range of Use Case: Attacks on ML systems used in both "security-sensitive" applications like cybersecurity and non-security-sensitive applications like chatbots.</li>
      </ol>
    </div>

    <div class="mb-10">{{ description }}</div>

    <info-table :items="mappedStudies" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    title: 'Case Studies',
    description: 'Browse the list of case studies below.',
    itemsPerPage: '20',
    page: 1,
    search: '',
    sortDesc: false,
    sortBy: 'name'
  }),
  computed: {
    ...mapGetters(['getStudies']),
    mappedStudies () {
      // Duplicate the 'summary' field into 'description' for use with InfoTable
      return this.getStudies.map((study) => {
        study.description = study.summary
        return study
      })
    }
  }
}
</script>
