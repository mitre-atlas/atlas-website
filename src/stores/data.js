// yamlStore.js
import { defineStore } from 'pinia'
import yaml from 'js-yaml'

export const useYamlStore = defineStore({
  id: 'yaml',
  state: () => ({
    yamlData: null
  }),
  actions: {
    async loadYamlFile(file) {
      try {
        const response = await fetch(file)
        const yamlString = await response.text()
        const parsedData = yaml.load(yamlString)
        this.yamlData = parsedData
      } catch (error) {
        console.error('Error loading or parsing YAML:', error)
      }
    }
  }
})
