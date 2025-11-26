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
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
@font-face {
  font-family: 'TradeGothicBold';
  src: url('@/assets/fonts/TradeGothicLTPro-Bold.otf');
  font-display: fallback;
}
</style>
