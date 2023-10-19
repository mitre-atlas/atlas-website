<template>
  <div>
    <!-- <h3>{{ yamlData }}</h3> -->
    <h3>Welcome!</h3>
    <h3>{{ tactic }}</h3>
  </div>
</template>

<script>
import { useYamlStore } from '../stores/data.js'
import { computed, onMounted } from 'vue' // Import onMounted
import { useMain } from '@/stores/main'


// const tactic = computed(() => {
//         console.log(main.getDataObjectById('AML.TA0001'))
//         return main.getDataObjectById('AML.TA0001');
//       });


export default {
  setup() {
    const yamlStore = useYamlStore()
    const main = useMain()

    // Load the YAML file when the component is mounted
    // onMounted(async () => {
    //   await main.init()
    //   // await yamlStore.loadYamlFile('/atlas-data/dist/ATLAS.yaml')
    
    // })
    console.log(main.getDataObjectById('AML.TA0001'))
    // Use a computed property to access the parsed YAML data
    const yamlData = computed(() => yamlStore.yamlData)

    return {
      yamlData
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
