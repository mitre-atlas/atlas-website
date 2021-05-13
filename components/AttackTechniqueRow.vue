<template>
  <tr class="technique-row">
    <td>
      <table class="supertechnique" v-if="'subtechniques' in technique">
        <tr>
          <td class="technique">
            <attack-technique-cell :technique="technique" isSupertechnique="true" />
          </td>
        </tr>
      </table>

      <attack-technique-cell v-else :technique="technique" />
    </td>

    <td
      class="sidebar"
      v-on:click="doShowSubtechniques = !doShowSubtechniques"
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

    <td class="subtechniques-td">
      <div
        :class="`subtechniques subtechniques-container ${toggleShow}`"
        v-for="(subtechnique, k) in technique.subtechniques"
        :key="k"
        >
        <div class="subtechnique">
          <attack-technique-cell :technique="subtechnique" />
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'AttackTechniqueRow',
  props: ['technique'],
  data: () => ({
    doShowSubtechniques: false
  }),
  computed: {
    toggleShow () {
      if (this.doShowSubtechniques) {
        return 'expanded'
      }
      return 'hidden'
    }
  }
}
</script>

<style scoped src="~/assets/matrix.css">
</style>
