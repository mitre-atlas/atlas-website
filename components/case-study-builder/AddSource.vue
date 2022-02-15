<template>
  <div id="sourceRender">
    <v-card>
      <v-card-title>
        <div v-if="index != null">Source {{index+1}}</div>
        <div v-else>Add Source</div>
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
        <v-spacer></v-spacer>
        <v-btn text color="grey" @click="$emit('addingBoolUpdate', false)">Cancel</v-btn>
        <v-btn text color="green" @click="addSource">Save</v-btn>
      </v-card-actions>

      <v-alert v-if="addSourceErr" color="red" text type="error" dense>{{ addSourceErr }}</v-alert>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "AddSource",
  props: {
    title: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    addingSource: {
      type: Boolean,
      default: false
    },
    index: Number
  },
  data() {
    return {
      titleData: this.title,
      urlData: this.url,
      addSourceErr: "",
      addingBool: this.addingSource
    };
  },
  methods: {
    updateValue(inputVal) {
      this.inputVal = inputVal;
    },
    // isValidHttpUrl(urlString) {
    //     let url;

    //     try {
    //         url = new URL(urlString);
    //     } catch (_) {
    //         return false;
    //     }

    //     return url.protocol === "http:" || url.protocol === "https:";
    // },
    addSource() {
      let url;
      // If url is empty, valid check remains true by default since field is optional
      let isUrlValid = true;

      // If both title and url fields are empty
      if (this.titleData === "" && this.urlData === "") {
        this.addSourceErr = "Please complete at least one field";
        return
      }

      // If url is not empt then it must be validated
      if (this.urlData != "") {
        console.log('URL is not empty');
        try {
          url = new URL(this.urlData);
        } catch (_) {
          isUrlValid = false
          this.addSourceErr = "URL cannot be found";
          return
        }
        if (isUrlValid) {
          if(url.protocol === "http:" || url.protocol === "https:") {
            isUrlValid = true
          }
          else {
            this.addSourceErr = "URL cannot be found";
            isUrlValid = false
          }
        }
      }

      // If there exists a title and url is validated
      if (this.titleData && isUrlValid) {
        console.log(this.urlData);
        const newSource = {
          title: this.titleData,
          url: this.urlData
        };
        this.$emit("clicked", newSource);
        this.clearSource();
      } else {
        this.addSourceErr = "Please complete at least one field";
      }
    },
    clearSource() {
      this.titleData = "";
      this.urlData = "";
      this.addSourceErr = "";
    }
  }
};
</script>
