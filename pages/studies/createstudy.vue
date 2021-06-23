<template>
  <div>
    <!-- <breadcrumbs></breadcrumbs> -->
    <page-title>{{ title }}</page-title>

    <v-row>
      <v-col sm="5">
        <v-file-input v-model="chosenFile" small-chips accept=".json" label="Upload JSON File" />
      </v-col>
      <v-col>
        <v-btn @click="readJSON">
          Populate Form
        </v-btn>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row>
          <v-text-field v-model="titleStudy" :rules="[v => !!v || 'Title is required']" label="Title" required @input="updateValue(titleStudy)" />
        </v-row>

        <v-row>
          <v-col sm="6">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required @input="updateValue(email)" />
          </v-col>

          <v-spacer />

          <v-col sm="6">
            <v-text-field v-model="reported" :rules="[v => !!v || 'Reporter is required']" label="Reported by:" required @input="updateValue(reported)" />
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="4">
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Incident date:"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="date"
                @input="dateMenu = false"
              />
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-textarea v-model="summary" :rules="[v => !!v || 'Summary is required']" label="Summary" required @input="updateValue(summary)" />
        </v-row>
      </v-container>

      <v-card outlined class="my-5">
        <v-card-title>Add Procedure Steps:</v-card-title>
        <v-card-actions class="px-md-4 mx-lg-auto">
          <v-autocomplete
            v-model="selectTactic"
            :items="getTactics"
            label="Tactic"
            item-text="name"
            item-value="id"
            @input="updateValue(selectTactic)"
          />

          <v-spacer />

          <v-autocomplete
            v-model="selectTechnique"
            :items="getTechniquesByTacticId(selectTactic)"
            label="Technique"
            item-text="name"
            item-value="id"
            :disabled="selectTactic === null"
            @input="updateValue(selectTechnique)"
          />
        </v-card-actions>

        <v-card-actions class="px-md-4 mx-lg-auto">
          <v-textarea v-model="description" :disabled="selectTactic === null" label="Description" required @input="updateValue(description)" />
        </v-card-actions>
        <v-card-actions>
          <v-btn class="ma-2" outlined color="blue" @click="addProcedureStep">
            Add Step
          </v-btn>
          <v-btn class="ma-2" outlined color="red" @click="clearStepInput">
            Clear
          </v-btn>
        </v-card-actions>
        <v-col sm="6">
          <v-alert v-if="addStepErr" color="red" outlined type="error" dense>
            {{ addStepErr }}
          </v-alert>
        </v-col>
      </v-card>

      <v-timeline v-if="procedure.length" align-top dense>
        <v-timeline-item v-for="(p, i) in procedure" :key="i" small>
          <procedure-card :info="p" />
        </v-timeline-item>
      </v-timeline>

      <v-card outlined class="my-5">
        <v-card-title>Add Sources:</v-card-title>

        <v-card-actions class="px-md-4 mx-lg-auto">
          <v-text-field v-model="sourceDescription" label="Source Description" @input="updateValue(sourceDescription)" />
        </v-card-actions>
        <v-card-actions class="px-md-4 mx-lg-auto">
          <v-text-field v-model="url" label="URL" @input="updateValue(url)" />
        </v-card-actions>

        <v-card-actions>
          <v-btn class="ma-2" outlined color="blue" @click="addSource">
            Add Source
          </v-btn>
          <v-btn class="ma-2" outlined color="red" @click="clearSource">
            Clear
          </v-btn>
        </v-card-actions>
        <v-col sm="6">
          <v-alert v-if="addSourceErr" color="red" outlined type="error" dense>
            {{ addSourceErr }}
          </v-alert>
        </v-col>
      </v-card>

      <div v-if="references.length" class="mx-8">
        <ol>
          <li v-for="(value, key) in references" :key="key">
            {{ value.sourceDescription }}
            <p v-linkified>
              {{ value.url }}
            </p>
          </li>
        </ol>
      </div>

      <v-btn class="my-5" outlined :disabled="!valid" x-large @click="submitStudy">
        Download Case Study
      </v-btn>
      <v-col sm="6">
        <v-alert v-if="errorMsg" color="red" outlined type="error" dense>
          {{ errorMsg }}
        </v-alert>
        <v-alert v-if="submissionMsg" color="green" outlined type="success" dense>
          {{ submissionMsg }} <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
        </v-alert>
      </v-col>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    title: 'Create A Case Study',
    valid: true,
    chosenFile: null,
    date: new Date().toISOString().substr(0, 10),
    dateMenu: false,
    selectTactic: null,
    selectTechnique: null,
    description: '',
    titleStudy: '',
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    summary: '',
    sourceDescription: '',
    url: '',
    reported: '',
    procedure: [],
    references: [],
    errorMsg: '',
    addStepErr: '',
    addSourceErr: '',
    submissionMsg: '',
    contactEmail: 'atlas@mitre.org'
  }),
  computed: {
    ...mapGetters(['getTactics', 'getTechniquesByTacticId'])
  },
  methods: {
    ...mapActions(['submitCaseStudy', 'createStudyFile']),
    updateValue (inputVal) {
      this.inputVal = inputVal
    },
    readJSON () {
      if (!this.chosenFile) {
        console.log('nothing inputted')
      } else {
        const reader = new FileReader()

        // Use the javascript reader object to load the contents
        // of the file in the v-model prop
        reader.readAsText(this.chosenFile)
        reader.onload = () => {
          const inputStudy = JSON.parse(reader.result)
          this.titleStudy = inputStudy.name
          this.summary = inputStudy.summary
          this.date = inputStudy['incident-date']
          this.procedure = inputStudy.procedure
          this.reported = inputStudy['reported-by']
          if (inputStudy.references === [] || !(inputStudy.references)) {
            this.references = []
          } else if (typeof inputStudy.references[0] === 'string') {
            this.references = this.editReferences(inputStudy.references)
          } else if (typeof inputStudy.references[0] === 'object') {
            this.references = inputStudy.references
          }
        }
      }
    },
    editReferences (refs) {
      const structuredRefs = []
      for (let i = 0; i < refs.length; i++) {
        const matches = refs[i].match(/(https?:\/\/[^ ]*)/)
        let thisRef = { sourceDescription: '', url: '' }
        if (matches) {
          thisRef = { sourceDescription: refs[i].replace(matches[1], ''), url: matches[1] }
        } else {
          thisRef = { sourceDescription: refs[i], url: '' }
        }
        structuredRefs.push(thisRef)
      }
      return structuredRefs
    },
    addProcedureStep () {
      if (this.selectTactic && this.selectTechnique && this.description) {
        const newStep = {
          tactic: this.selectTactic,
          technique: this.selectTechnique,
          description: this.description
        }
        this.procedure.push(newStep)
        this.clearStepInput()
      } else {
        this.addStepErr = 'Please complete all fields'
      }
    },
    clearStepInput () {
      this.selectTactic = null
      this.selectTechnique = null
      this.description = ''
      this.addStepErr = ''
    },
    addSource () {
      if (this.sourceDescription || this.url) {
        const newSource = {
          sourceDescription: this.sourceDescription,
          url: this.url
        }
        this.references.push(newSource)
        this.clearSource()
      } else {
        this.addSourceErr = 'Please complete at least one field'
      }
    },
    clearSource () {
      this.sourceDescription = ''
      this.url = ''
      this.addSourceErr = ''
    },
    submitStudy () {
      if (this.$refs.form.validate() && this.procedure.length) {
        this.errorMsg = ''
        const study = {
          // id: ,
          name: this.titleStudy,
          // object-type: 'case-study',
          summary: this.summary,
          'incident-date': this.date,
          procedure: this.procedure,
          'reported-by': this.reported,
          references: this.references
        }
        this.submitCaseStudy(study)
        this.createStudyFile(study)
        this.submissionMsg = 'Your case study has been downloaded! Email your json file to '
      } else if (!this.$refs.form.validate()) {
        this.errorMsg = 'Please complete all required fields'
      } else if (!this.procedure.length) {
        this.errorMsg = 'Please add at least one procedure step'
      }
    }
  }
}
</script>
