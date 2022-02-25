<template>
  <v-card>
    <v-card-title>
      <v-icon
        left
      >
        {{ tacticIconMapping[info.name] }}
      </v-icon>
      {{ info.name }}
    </v-card-title>

    <v-card-actions>
      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

      <v-spacer />

      <v-btn
        color="teal accent-4"
        text
      >
        Explore {{ info.techniques.length }} techniques
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider />
        <v-card-subtitle>
          {{ info.id }}
        </v-card-subtitle>
        <v-card-text v-html="info.description" />
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: 'TacticCard',
  props: ['info'],
  data: () => ({
    show: false,
    tacticIconMapping: {
      'Model Evasion': 'mdi-eye-off',
      Collection: 'mdi-file-multiple',
      'Command and Control': 'mdi-lan-connect',
      'Credential Access': 'mdi-key',
      'Defense Evasion': 'mdi-security',
      Discovery: 'mdi-cloud-search',
      Execution: 'mdi-xml',
      Exfiltration: 'mdi-package-down',
      Impact: 'mdi-fire',
      'Initial Access': 'mdi-door-open',
      'Lateral Movement': 'mdi-swap-horizontal-bold',
      Reconnaissance: 'mdi-account-search',
      'Privilege Escalation': 'mdi-shield-account',
      'Resource Development': 'mdi-apps',
      Persistence: 'mdi-lock-open-plus'
    }
  })
}
</script>
