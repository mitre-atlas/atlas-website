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
          @change="$emit('studyTypeUpdate', studyType)"
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
              v-for="t in studyFields['case_study_type'].options"
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
/**
 * Input card for case study type in the case study builder
 */
export default {
  name: 'CaseStudyType',
  props: [
    /**
     * Case study type, currently "exercise" or "incident"
     * @type {String}
     */
    'caseStudyType',
    /**
     * Validation rules for case study type
     * @type {function[]}
     */
    'rules',
    /**
     * Whether a download has been attempted on the case study builder page
     * @type {Boolean}
     */
    'hasSubmissionBeenAttempted',
    /**
     * Case study builder field names, descriptions, and icons
     * as defined in `case-study-legend.yaml`
     * @type {object}
     */
    'fields'
  ],
  data () {
    return {
      /**
       * Validation rules for case study type
       * @type {function[]}
       */
      studyRules: this.rules,
      /**
       * Case study builder field names, descriptions, and icons
       * as defined in `case-study-legend.yaml`
       * @type {object}
       */
      studyFields: this.fields,
      /**
       * Case study type, currently "exercise" or "incident"
       * @type {String}
       */
      studyType: this.caseStudyType,
      /**
       * Validation rule for "required", or non-empty input
       * @todo Remove this in favor of better validation logic in computed property
       * @type {function}
       */
      caseStudyTypeRule: v => !!v
    }
  },
  computed: {
    /**
     * Ensures that the provided case study type value is not empty,
     * alternatively that a submission has not yet been attempted
     * @todo Update logic and determine need for second clause
     */
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
  }
}
</script>
