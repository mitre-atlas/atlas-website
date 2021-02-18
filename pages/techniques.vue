<template>
<div>
  <b-list-group>
    <b-list-group-item v-for="(val, key, index) in techniques" :key="index">
      <div>
        <h5>{{key}}</h5>
        <div v-if="typeof val === 'object' && val !== null">
          <div v-for="(v, k, i) in val" :key="i">
          <h6>{{k}}</h6>
          <p>{{v}}</p>
          </div>
        </div>
        <p v-else>{{val}}</p>
      </div>
      </b-list-group-item>
  </b-list-group>
</div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const techniques = await $content('threat-matrix/techniques').fetch()

    return { techniques }
  }
}
</script>
