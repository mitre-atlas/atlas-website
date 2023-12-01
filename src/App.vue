<template>
  <Layout>
    <div class="row flex-center">
      <router-view />
    </div>
  </Layout>
</template>

<script>
import Data from './components/Data.vue'
import Layout from './layouts/default.vue'
import { computed } from 'vue' 

export default {
  name: 'App',
  components: {
    Data, Layout
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
