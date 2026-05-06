<template>
  <div class="mt-16">
    <p class="text-h5">Contributors</p>
    <p>Thank you to our many active contributors, including, but not limited to:</p>
    <v-row v-if="!smAndDown">
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, i) in contributorsA" :key="i" :title="item.organization">
            <v-expansion-panel-text v-for="(name, i) in item.contributors" :key="i" class="text-caption">
              {{ name }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, i) in contributorsB" :key="i" :title="item.organization">
            <v-expansion-panel-text v-for="(name, i) in item.contributors" :key="i" class="text-caption">
              {{ name }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-expansion-panels>
        <v-expansion-panel v-for="(item, i) in contributors" :key="i" :title="item.organization">
          <v-expansion-panel-text v-for="(name, i) in item.contributors" :key="i" class="text-caption">
            {{ name }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script setup>
import jsyaml from 'js-yaml'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { getPathWithBase } from '@/assets/tools.js'

const { smAndDown } = useDisplay()

const contributors = ref([])
const contributorsA = ref([])
const contributorsB = ref([])

fetch(getPathWithBase('/content/contributorslist.yaml'))
  .then((response) => response.text())
  .then((data) => {
    const contents = jsyaml.load(data)

    // Sort contributors alphabetically
    contributors.value = contents.data.map((c) => {
      // May be no contributors field, only organization name
      if (c.contributors) c.contributors.sort()
      return c
    })

    // Sort by organization name
    contributors.value.sort((a, b) =>
      a.organization > b.organization ? 1 : a.organization < b.organization ? -1 : 0
    )

    // Split into two columns
    const splitIndex = Math.ceil(contributors.value.length / 2)
    contributorsA.value = contributors.value.slice().splice(0, splitIndex)
    contributorsB.value = contributors.value.slice().splice(splitIndex, contributors.value.length)
  })
  .catch((error) => {
    console.error('Error fetching YAML file:', error)
  })
</script>
