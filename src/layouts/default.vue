<template>
    <v-app>
        <v-main>
            <slot />
        </v-main>
        <Footer />
    </v-app>
</template>


  
<script setup>
  const name = "Default";
  
  import Footer from '@/components/Footer.vue'
  import { useMain } from "@/stores/main"
  import { computed } from 'vue' 
  const mainStore = useMain();
  

  
  // const populatedTactics = computed(() => Object.values(mainStore.getDataObjectsByType('tactics', 'ATLAS')))
  
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
  