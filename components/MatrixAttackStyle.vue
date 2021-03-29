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
            {{ tactic.techniques.length }} techniques
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
              <tbody>
              <tr
                class="technique-row"
                v-for="(technique, j) in tactic.techniques"
                :key="j"
                >
                <td
                  class="sidebar"
                  v-if="'subtechniques' in technique"
                  >
                  <div class="angle top">
                    <svg width="12px" height="12px">
                      <path d="M0 12H12V0Z"/>
                    </svg>
                  </div>
                  <div class="handle"> = </div>
                  <div class="angle bottom">
                    <svg width="12px" height="12px">
                      <path d="M0 0H12V12Z"/>
                    </svg>
                  </div>
                </td>
                <td
                  v-else
                  >
                  <table class="supertechnique">
                    <tr>
                      <td class="technique">
                        <!-- technique cell -->
                        <div class="technique-cell">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <nuxt-link
                                :to="`/techniques/${technique.id}`"
                                style="text-decoration: none;"
                                v-bind="attrs"
                                v-on="on"
                                >
                                {{ technique.name }}
                              </nuxt-link>
                            </template>
                            <span>{{ technique.id }}</span>
                          </v-tooltip>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
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

<style scoped src="@/static/matrix.css">
</style>
