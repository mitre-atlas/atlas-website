<template>
  <div>
    <h3>{{ yamlData }}</h3>
  </div>
</template>

<script>
import { useYamlStore } from '../stores/data.js'
import { computed, onMounted } from 'vue' // Import onMounted

export default {
  setup() {
    const yamlStore = useYamlStore()

    // Load the YAML file when the component is mounted
    onMounted(async () => {
      await yamlStore.loadYamlFile('public/atlas-data/dist/ATLAS.yaml')
    })

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
