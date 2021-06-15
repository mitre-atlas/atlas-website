<template>
  <div>
    <breadcrumbs></breadcrumbs>
    <page-title>{{ title }}</page-title>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row>
          <v-text-field v-model="titleStudy" :rules="[v => !!v || 'Title is required']" label="Title" required @input="updateValue(titleStudy)" />
        </v-row>

        <v-row>
          <v-col sm="4">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required @input="updateValue(email)" />
          </v-col>

          <v-spacer />

          <v-col sm="4">
            <v-text-field v-model="reported" :rules="[v => !!v || 'Reporter is required']" label="Reported by:" required @input="updateValue(reported)" />
          </v-col>

          <v-spacer />

          <v-col sm="3">
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
                  label="Date reported:"
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
          <v-select
            v-model="selectTactic"
            :items="getTactics"
            label="Tactic"
            item-text="name"
            item-value="id"
            @input="updateValue(selectTactic)"
          />

          <v-spacer />

          <v-select
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
      </v-card>

      <v-card outlined class="my-5">
        <v-card-title>Add Sources:</v-card-title>

        <v-card-actions class="px-md-4 mx-lg-auto">
          <v-text-field v-model="source" label="Source" @input="updateValue(source)" />
        </v-card-actions>
        <v-card-actions class="px-md-4 mx-lg-auto">
          <v-text-field v-model="sourceLink" label="Link" @input="updateValue(sourceLink)" />
        </v-card-actions>

        <v-card-actions>
          <v-btn class="ma-2" outlined color="blue" @click="addSource">
            Add Source
          </v-btn>
          <v-btn class="ma-2" outlined color="red" @click="clearSource">
            Clear
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-btn class="my-5" outlined :disabled="!valid" x-large @click="submitStudy">
        Submit Case Study
      </v-btn>
      <v-col sm="6">
        <v-alert v-if="errorMsg" color="red" outlined type="error" dense>
          {{ errorMsg }}
        </v-alert>
        <v-alert v-if="submissionMsg" color="green" outlined type="success" dense>
          {{ submissionMsg }}
        </v-alert>
      </v-col>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: ({ $config: { name } }) => ({
    title: 'Create A Case Study',
    valid: true,
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
    source: '',
    sourceLink: '',
    reported: '',
    procedure: [],
    references: [],
    // study: [],
    errorMsg: '',
    submissionMsg: ''
  }),
  computed: {
    ...mapGetters(['getTactics', 'getTechniquesByTacticId'])
  },
  methods: {
    ...mapActions(['submitCaseStudy', 'createStudyFile']),
    updateValue (inputVal) {
      this.inputVal = inputVal
    },
    addProcedureStep () {
      const newStep = {
        tactic: this.selectTactic,
        technique: this.selectTechnique,
        description: this.description
      }
      this.procedure.push(newStep)
      this.clearStepInput()
    },
    clearStepInput () {
      this.selectTactic = null
      this.selectTechnique = null
      this.description = ''
    },
    addSource () {
      const newSource = {
        source: this.source,
        sourceLink: this.sourceLink
      }
      this.references.push(newSource)
      this.clearSource()
    },
    clearSource () {
      this.source = ''
      this.sourceLink = ''
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
        // this.study = study
        this.submitCaseStudy(study)
        this.createStudyFile(study)
        this.submissionMsg = 'Your case study has been submitted!'
        // console.log(this.study)
        // console.log(state.caseStudy)
      } else if (!this.$refs.form.validate()) {
        this.errorMsg = 'Please complete all required fields'
      } else if (!this.procedure.length) {
        this.errorMsg = 'Please add at least one procedure step'
      }
    }
  }
}
</script>
