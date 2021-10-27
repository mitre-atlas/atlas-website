<template>
  <div id="sourceRender">
    <v-card>
      <v-card-title>
        <div v-if="index != null">
          Source {{index+1}}
        </div>
        <div v-else>
        Add Source
        </div>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="sourceDescriptionData"
          label="Description"
          hint="Brief description (optional)"
          outlined
          prepend-inner-icon="mdi-format-title"
          @input="updateValue(sourceDescriptionData)"
        />

        <v-text-field
          v-model="urlData"
          label="URL"
          hint="Link (optional)"
          outlined
          prepend-inner-icon="mdi-link"
          @input="updateValue(urlData)"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="grey" @click="$emit('addingBoolUpdate', false)">
          Cancel
        </v-btn>
        <v-btn text color="green" @click="addSource">
          Save
        </v-btn>
      </v-card-actions>

        <v-alert v-if="addSourceErr" color="red" text type="error" dense>
          {{ addSourceErr }}
        </v-alert>

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
