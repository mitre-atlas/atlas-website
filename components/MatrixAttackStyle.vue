<!-- Translated from https://github.com/mitre-attack/attack-website/blob/master/attack-theme/templates/macros/matrix.html#L155-L226 -->
<template>
  <div>
    <table class="matrix side">
      <thead>
        <tr>
          <td
            class="tactic name"
            v-for="(tactic, i) in matrix.tactics"
            :key="i"
            >
            <nuxt-link
              :to="`/tactics/${tactic.id}`"
              style="text-decoration: none;"
              >
              {{ tactic.name }}
            </nuxt-link>
          </td>
        </tr>
        <tr>
          <td
            class="tactic count"
            v-for="(tactic, i) in matrix.tactics"
            :key="i"
            >
            {{ tactic.techniques.length + " " + (tactic.techniques.length == 1 ? "technique" : "techniques") }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            class="tactic"
            v-for="(tactic, i) in matrix.tactics"
            :key="i"
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
export default {
  name: 'MatrixAttackStyle',
  props: ['matrix']
}
</script>

<style scoped src="~/assets/matrix.css">
</style>
