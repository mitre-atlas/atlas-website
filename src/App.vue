<template>
  <Layout>
    <div class="row flex-center">
      <router-view :key="$route.path" />
    </div>
  </Layout>
</template>

<script>
import Layout from './layouts/default.vue'
import '@/assets/global.css'

export default {
  name: 'App',
  components: {
    Layout
  }
}
</script>

<style>
@font-face {
  font-family: 'TradeGothicBold';
  src: url('@/assets/fonts/TradeGothicLTPro-Bold.otf');
  font-display: fallback;
}
</style>
