<template>
  <Layout>
    <div class="row flex-center">
      <router-view :key="$route.path"/>
    </div>
  </Layout>
</template>

<script>
import Layout from './layouts/default.vue'
import { computed } from 'vue' 
import '@/assets/global.css'

export default {
  name: 'App',
  components: {
    Layout
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
}
</style>
