<template>
  <div id="sourceRender">
    <v-card outlined :style="cardStyle">
      <v-card-title :style="headerStyle">
        <div v-if="index != null">
          Source {{ index+1 }}
        </div>
        <div v-else>
          Add Source
        </div>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="titleData"
          label="Description"
          hint="Brief description (optional)"
          outlined
          prepend-inner-icon="mdi-format-title"
        />

        <v-text-field
          v-model="urlData"
          label="URL"
          hint="Link (optional)"
          outlined
          prepend-inner-icon="mdi-link"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="grey" @click="$emit('addingBoolUpdate', false)">
          Cancel
        </v-btn>
        <v-btn id="save_reference" text color="green" @click="addSource">
          Save
        </v-btn>
      </v-card-actions>

      <v-alert v-if="addSourceErr" color="red" text type="error" dense>
        {{ addSourceErr }}
      </v-alert>
    </v-card>
    <v-card-subtitle v-if="hasStatus" class="py-2" :style="headerStyle">
      {{
        submissionStatus.message
      }}
    </v-card-subtitle>
  </div>
</template>

<script>
import { statusStyleHeader, statusStyleCard } from '~/assets/validation.js'
/**
 * Card for adding and editing a case study source item
 */
export default {
  name: 'AddSource',
  props: {
    // Title of the source
    title: {
      type: String,
      default: ''
    },
    // URL for the source
    url: {
      type: String,
      default: ''
    },
    // Index of this source item in the larger list
    index: {
      type: Number,
      default: null
    },
    // Submission status for this item
    submissionStatus: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      /**
       * Title of the source
       * @type {String}
       */
      titleData: this.title,
      /**
       * URL for the source
       * @type {String}
       */
      urlData: this.url,
      // Error text for this source box
      addSourceErr: ''
    }
  },
  computed: {
    /**
     * Returns true if the submission status has a type
     * @returns {Boolean}
     */
    hasStatus () {
      return !!(this.submissionStatus ?? {}).type
    },
    /**
     * Sets card title font color according to submission state
     */
    headerStyle () {
      return statusStyleHeader(this.submissionStatus)
    },
    /**
     * Sets card outline border color according to submission state
     */
    cardStyle () {
      return statusStyleCard(this.submissionStatus)
    }
  },
  methods: {
    // Validates source fields, onstructs the new source object and emits it, or sets an error message
    addSource () {
      let url
      // If url is empty, valid check remains true by default since field is optional
      let isUrlValid = true

      // If both title and url fields are empty
      if (this.titleData === '' && this.urlData === '') {
        this.addSourceErr = 'Please complete at least one field'
        return
      }

      // If url is not empty then it must be validated
      if (this.urlData !== '') {
        try {
          url = new URL(this.urlData) // eslint-disable-line no-unused-vars
        } catch (_) {
          isUrlValid = false
          this.addSourceErr = 'URL cannot be found or does not start with http(s)://'
          return
        }
      }

      // If there exists a title and url is validated
      if ((this.titleData === '' || this.titleData) && isUrlValid) {
        const newSource = {
          title: this.titleData,
          url: this.urlData
        }
        this.$emit('clicked', newSource)
        this.clearSource()
      } else {
        this.addSourceErr = 'Please complete at least one field'
      }
    },
    // Resets data fields
    clearSource () {
      this.titleData = ''
      this.urlData = ''
      this.addSourceErr = ''
    }
  }
}
</script>
