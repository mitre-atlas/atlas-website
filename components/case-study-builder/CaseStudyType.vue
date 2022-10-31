<template>
  <v-hover v-slot="{ hover }">
    <v-card
      id="cs-type-card"
      outlined
      class="mb-7 case-study-type"
      :style="[
        hover && isStudyTypeValid
          ? { 'border-color': '#424242' }
          : { 'border-color': '#9E9E9E' },
        !isStudyTypeValid
          ? { 'border-color': '#FF5252', 'border-width': '2px' }
          : {}
      ]"
    >
      <v-card-text class="py-0">
        <v-radio-group
          v-model="studyType"
          :prepend-icon="studyFields.case_study_type.icon"
          :rules="studyRules"
          @change="studyTypeChange(studyType)"
        >
          <template #label>
            Select case study type
            <span
              v-if="!isStudyTypeValid"
              class="text-caption red--text text--accent-2 ml-10"
            >
              <v-icon style="color: #ff5252">mdi-menu-right</v-icon>
              Required
            </span>
            <div
              v-for="t in caseStudyTypes"
              :id="t.name"
              :key="t"
              class="button-tooltip-container"
            >
              <v-tooltip
                color="transparent"
                right
                transition="fade-transition"
                :attach="`#${t.name}`"
              >
                <template #activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    <v-radio
                      :key="t.name"
                      :label="t.name"
                      :value="t.name.toLowerCase()"
                    />
                  </span>
                </template>
                <v-row class="text-caption grey--text text--darken-1">
                  <v-col cols="1">
                    <v-icon>mdi-menu-right</v-icon>
                  </v-col>
                  <v-col>
                    <div style="position: relative; top: 2px">
                      {{ t.description }}
                    </div>
                  </v-col>
                </v-row>
              </v-tooltip>
            </div>
          </template>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'CaseStudyType',
  props: [
    'caseStudyType',
    'rules',
    'hasSubmissionBeenAttempted',
    'studyTypes',
    'fields'
  ],
  data () {
    return {
      studyRules: this.rules,
      caseStudyTypes: this.studyTypes,
      studyFields: this.fields,
      studyType: this.caseStudyType,
      submissionBool: this.hasSubmissionBeenAttempted,
      caseStudyTypeRule: v => !!v
    }
  },
  computed: {
    isStudyTypeValid () {
      return (
        this.caseStudyTypeRule(this.studyType) ||
        !this.hasSubmissionBeenAttempted
      )
    }
  },
  watch: {
    caseStudyType: {
      immediate: true,
      handler (newVal, oldVal) {
        this.studyType = newVal
      }
    }
  },
  methods: {
    studyTypeChange (selectStudyType) {
      this.$emit('studyTypeUpdate', selectStudyType)
    }
  }
}
</script>
