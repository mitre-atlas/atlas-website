<!-- Translated from https://github.com/mitre-attack/attack-website/blob/master/attack-theme/templates/macros/matrix.html#L155-L226 -->
<template>
  <div>
    <table class="matrix side">
      <thead>
        <tr>
          <td v-for="(tactic, i) in tactics" :key="i" class="tactic name">
            <router-link :to="`/tactics/${tactic.id}`">
              {{ tactic.name.substr(0, tactic.name.length - tacticLastWord(tactic.name).length) }}
            </router-link>
            <div style="white-space: nowrap">
              <router-link :to="`/tactics/${tactic.id}`">
                {{ tacticLastWord(tactic.name) }}
              </router-link>
              <span v-if="'ATT&CK-reference' in tactic" class="attack-and">&</span>
            </div>
          </td>
        </tr>
        <tr>
          <td v-for="(tactic, i) in tactics" :key="i" class="tactic count">
            {{
              tactic.techniques.length +
              ' ' +
              (tactic.techniques.length == 1 ? 'technique' : 'techniques')
            }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="(tactic, i) in tactics" :key="i" class="tactic">
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

<script setup>
/**
 * Attack style matrix that contains the ATLAS data. This matrix appears on the home page and the matrices page.
 */
import { lastWord } from '@/assets/tools.js'
import AttackTechniqueRow from '@/components/matrix/AttackTechniqueRow.vue'

const props = defineProps({
  /**
   * List of tactics to create columns for the matrix
   * @type {Object}
   */
  tactics: Object
})

const tacticLastWord = (tactic_name) => {
  return lastWord(tactic_name)
}
</script>

<style scoped src="@/assets/matrix.css"></style>
