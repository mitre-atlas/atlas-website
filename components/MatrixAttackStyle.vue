<!-- Translated from https://github.com/mitre-attack/attack-website/blob/master/attack-theme/templates/macros/matrix.html#L155-L226 -->
<template>
  <div>
    <table class="matrix side">
      <thead>
        <tr>
          <td
            v-for="(tactic, i) in tactics"
            :key="i"
            class="tactic name"
          >
            <nuxt-link
              :to="`/tactics/${tactic.id}`"
            >
              {{ tactic.name.substr(0, (tactic.name.length - tacticLastWord(tactic.name).length)) }}
            </nuxt-link>
            <div style="white-space: nowrap;">
              <nuxt-link
                :to="`/tactics/${tactic.id}`"
              >
                {{ tacticLastWord(tactic.name) }}
              </nuxt-link>
              <span v-if="'ATT&CK-reference' in tactic" class="attack-and">&</span>
            </div>
          </td>
        </tr>
        <tr>
          <td
            v-for="(tactic, i) in tactics"
            :key="i"
            class="tactic count"
          >
            {{ tactic.techniques.length + " " + (tactic.techniques.length == 1 ? "technique" : "techniques") }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="(tactic, i) in tactics"
            :key="i"
            class="tactic"
          >
            <table class="techniques-table">
              <tbody v-for="(technique, j) in tactic.techniques" :key="j">
                <attack-technique-row :technique="technique" />
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { lastWord } from '~/assets/tools.js'
/**
 * Attack style matrix that contains the ATLAS data. This matrix appears on the home page and the matrices page.
 */
export default {
  name: 'MatrixAttackStyle',
  props: [
    /**
     * List of tactics to create columns for the matrix
     * @type {Object}
     */
    'tactics'
  ],
  methods: {
    tacticLastWord (tactic) {
      return lastWord(tactic)
    }
  }
}
</script>

<style scoped src="~/assets/matrix.css">
</style>
