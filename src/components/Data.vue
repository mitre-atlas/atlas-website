<template>
  <div>
    <h3>Welcome!</h3>
    <h3>{{ tactic }}</h3>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue' // Import onMounted
import { useMain } from '@/stores/main'


export default {
  setup() {
    const main = useMain()


    // Load the YAML file when the component is mounted
    onMounted(async () => {
      await main.init()
    
    })
    const tactic = computed(() => {
            return main.getDataObjectById('AML.TA0001');
          });

    return {
      tactic
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
