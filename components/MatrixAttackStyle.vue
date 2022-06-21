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
              {{ tactic.name }}
            </nuxt-link>
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
export default {
  name: 'MatrixAttackStyle',
  props: ['tactics']
}
</script>

<style scoped src="~/assets/matrix.css">
</style>
