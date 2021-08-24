<template>
  <div id="sourceRender">
    <v-card outlined class="my-5">
      <v-card-title>
        <div v-if="index != null">
          Source {{index+1}}
        </div>
        <div v-else>
        Add Sources:
        </div>
      </v-card-title>

      <v-card-actions class="px-md-4 mx-lg-auto">
        <v-text-field v-model="sourceDescriptionData" label="Source Description" @input="updateValue(sourceDescriptionData)" />
      </v-card-actions>
      <v-card-actions class="px-md-4 mx-lg-auto">
        <v-text-field v-model="urlData" label="URL" @input="updateValue(urlData)" />
      </v-card-actions>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="ma-2" text color="grey" @click="$emit('addingBoolUpdate', false)">
          Cancel
        </v-btn>
        <v-btn class="ma-2" text color="green" @click="addSource">
          Save
        </v-btn>
      </v-card-actions>
      <v-col sm="6">
        <v-alert v-if="addSourceErr" color="red" outlined type="error" dense>
          {{ addSourceErr }}
        </v-alert>
      </v-col>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AddSource',
  props: [
    'sourceDescription',
    'url',
    'addingSource',
    'index'
  ],
  data () {
    return {
      sourceDescriptionData: this.sourceDescription,
      urlData: this.url,
      addSourceErr: '',
      addingBool: this.addingSource
    }
  },
  methods: {
    updateValue (inputVal) {
      this.inputVal = inputVal
    },
    addSource () {
      if (this.sourceDescriptionData || this.urlData) {
        const newSource = {
          sourceDescription: this.sourceDescriptionData,
          url: this.urlData
        }
        this.$emit('clicked', newSource)
        this.clearSource()
      } else {
        this.addSourceErr = 'Please complete at least one field'
      }
    },
    clearSource () {
      this.sourceDescriptionData = ''
      this.urlData = ''
      this.addSourceErr = ''
    }
  }
}
</script>
