<template>
  <v-row v-if="isBuilder" align="start">
    <v-container>
      <v-checkbox
        v-model="pptCheckbox"
        label="Include Case Study PPT"
        @change="changeCheckbox"
        elevation="0"
        color="inherit"
      ></v-checkbox>
      </v-container>
    </v-row>
  <v-btn
    v-else
    elevation="0"
    color="inherit"
    v-bind="attrs"
    v-on="on"
    @click="makePPT()"
  >
    Download Powerpoint
  </v-btn>
</template>

<script>
import Pptxgen from 'pptxgenjs'
import { MITRE_ATLAS_TM_LOGO } from '../assets/base64_atlas_logo'
export default {
  name: 'DownloadPowerpoint',
  props: ['study', 'builder'],
  data () {
    return {
      studyYaml: this.study,
      isBuilder: this.builder,
      pptCheckbox: ''
    }
  },
  watch: { // TODO: Ensure that this component watches the state of the yaml file to update itself if the yaml changes
    study: {
      immediate: true,
      handler (newYaml, oldYaml) {
        this.studyYaml = newYaml
      }
    }
  },
  methods: {
    changeCheckbox () {
      this.$emit('updateCheckbox', this.pptCheckbox)
    },
    makePPT (filename) {
      const ppt = new Pptxgen()
      ppt.layout = 'LAYOUT_16x9'
      // Slide layout with just title
      ppt.defineSlideMaster({
        title: 'Content',
        background: { color: 'FFFFFF' },
        objects: [
          {
            placeholder: {
              options: {
                name: 'title',
                type: 'title',
                x: 0.5,
                y: 0.5,
                w: '100%',
                align: 'left',
                fontFace: 'Arial',
                fontSize: 24,
                color: '0D2F4F',
                isTextBox: true
              },
              text: 'Title'
            }
          },
          {
            image: {
              x: '5%',
              y: '93%',
              w: 1.2,
              h: 0.18,
              data: MITRE_ATLAS_TM_LOGO()
            }
          },

          {
            text: {
              text: '© 2021 THE MITRE CORPORATION. ALL RIGHTS RESERVED.',
              options: {
                y: '95%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 8,
                color: '0D2F4F'
              }
            }
          }
        ],
        slideNumber: { x: '95%', y: '93%', fontFace: 'Arial', fontSize: 8, color: '0D2F4F' }
      })

      if (!this.isBuilder) {
        const studyTemp = { study: this.studyYaml }
        this.studyYaml = studyTemp
      }
      this.titleSlide(ppt, this.studyYaml)
      this.detailSlide(ppt, this.studyYaml)
      this.procedureSlide(ppt, this.studyYaml)
      if (this.studyYaml.study.references) {
        this.referenceSlide(ppt, this.studyYaml)
      }

      // Use case study title if no argument provided
      if (typeof filename === 'undefined') {
        filename = this.studyYaml.study.name
      }

      ppt.writeFile({ fileName: `${filename}.pptx` })
    },
    titleSlide (ppt, yaml) {
      ppt.defineSlideMaster({
        title: 'Title',
        background: { color: 'FFFFFF' },
        objects: [
          {
            image: {
              x: '42%',
              y: '15%',
              w: 1.5,
              h: 0.22,
              data: MITRE_ATLAS_TM_LOGO()
            }
          },
          {
            placeholder: {
              options: {
                name: 'title',
                type: 'title',
                y: '25%',
                w: '100%',
                h: 2,
                align: 'center',
                valign: 'middle',
                fontFace: 'Arial',
                fontSize: 36,
                color: '0D2F4F',
                isTextBox: true
              },
              text: 'Title'
            }
          },
          {
            text: {
              text: 'ATLAS Case Study',
              options: {
                y: '78%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 14,
                color: '0D2F4F',
                isTextBox: true
              }
            }
          },

          {
            placeholder: {
              options: {
                name: 'incidentDate',
                type: 'body',
                y: '82%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 14,
                color: '0D2F4F',
                isTextBox: true
              },
              text: 'Incident Date'
            }
          },
          {
            placeholder: {
              options: {
                name: 'reportedBy',
                type: 'body',
                y: '88%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 14,
                color: '0D2F4F',
                isTextBox: true
              },
              text: 'Reported by'
            }
          }
        ]
      })

      let formattedDate = null
      if (yaml.study.dateGranularity === 'YEAR') {
        formattedDate = yaml.study['incident-date'].toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric' }
        )
      } else if (yaml.study.dateGranularity === 'MONTH') {
        formattedDate = yaml.study['incident-date'].toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long' }
        )
      } else if (
        // TODO some case studies have incident-date-granularity, remove this undefined check once fixed
        yaml.study.dateGranularity === undefined ||
        yaml.study.dateGranularity === 'DATE'
      ) {
        // If dateGranularity is DATE, or there is no date granularity
        formattedDate = yaml.study['incident-date'].toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
        )
      }

      // Workaround for erroneous list item, TBD removal
      let reportedBy = yaml.study['reported-by']
      if (Array.isArray(reportedBy)) {
        reportedBy = reportedBy[0]
      }

      ppt
        .addSlide({ masterName: 'Title' })
        .addText(yaml.study.name, { placeholder: 'title' })
        .addText(reportedBy, { placeholder: 'reportedBy' })
        .addText(formattedDate, { placeholder: 'incidentDate' })
    },
    detailSlide (ppt, yaml) {
      ppt.defineSlideMaster({
        title: 'Summary',
        background: { color: 'FFFFFF' },
        objects: [
          {
            placeholder: {
              options: {
                name: 'title',
                type: 'title',
                x: 0.5,
                y: 0.5,
                w: '100%',
                h: 1,
                align: 'left',
                fontFace: 'Arial',
                fontSize: 24,
                color: '0D2F4F',
                isTextBox: true
              },
              text: 'Title'
            }
          },
          {
            placeholder: {
              options: {
                name: 'content',
                type: 'body',
                x: 0.5,
                y: 1.2,
                w: 9,
                h: 4,
                align: 'left',
                fontFace: 'Arial',
                fontSize: 12,
                color: '0D2F4F',
                isTextBox: true,
                lineSpacingMultiple: 1.15
              },
              text: 'Content'
            }
          },
          {
            image: {
              x: '5%',
              y: '93%',
              w: 1.2,
              h: 0.18,
              data: MITRE_ATLAS_TM_LOGO()
            }
          },

          {
            text: {
              text: '© 2021 THE MITRE CORPORATION. ALL RIGHTS RESERVED.',
              options: {
                y: '95%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 8,
                color: '0D2F4F'
              }
            }
          }
        ],
        slideNumber: { x: '95%', y: '93%', fontFace: 'Arial', fontSize: 8, color: '0D2F4F' }
      })

      ppt.addSlide({ masterName: 'Summary' })
        .addText('Summary', { placeholder: 'title' })
        .addText(yaml.study.summary, { placeholder: 'content' })
    },
    getUrlFromInfoObject (infoObject) {
      const baseUrl = window.location.origin
      return `${baseUrl}/${infoObject['object-type']}s/${infoObject.id}`
    },
    linkText (text, url) {
      return { text, options: { hyperlink: { url }, fontFace: 'Arial', fontSize: 10 } }
    },
    procedureSlide (ppt, yaml) {
      const rows = [
        [
          {
            text: '#',
            options: {
              fill: '005B94',
              color: 'ffffff',
              align: 'center',
              bold: true,
              fontFace: 'Arial',
              fontSize: 10
            }
          },
          {
            text: 'Technique',
            options: {
              fill: '005B94',
              color: 'ffffff',
              align: 'center',
              bold: true,
              fontFace: 'Arial',
              fontSize: 10
            }
          },
          {
            text: 'Description',
            options: {
              fill: '005B94',
              color: 'ffffff',
              align: 'center',
              bold: true,
              fontFace: 'Arial',
              fontSize: 10
            }
          }
        ]
      ]
      for (let i = 0; i < yaml.study.procedure.length; i++) {
        // const tacticId = yaml.study.procedure[i].tactic
        const techniqueId = yaml.study.procedure[i].technique
        const description = yaml.study.procedure[i].description

        // const tacticInfo = this.$store.getters.getTacticById(tacticId)
        const techniqueInfo = this.$store.getters.getTechniqueById(techniqueId)

        // const tacticLabel = [
        //   { text: tacticInfo.name },
        //   this.linkText(tacticId, this.getUrlFromInfoObject(tacticInfo))
        // ]
        // const techniqueLabel = [
        //   { text: techniqueInfo.name },
        //   this.linkText(techniqueId, this.getUrlFromInfoObject(techniqueInfo))
        // ]
        // console.log(techniqueLabel, tacticLabel)

        // const workaroundTacticLabel = `${tacticInfo.name}\n${tacticId}`
        const workaroundTecniqueLabel = `${techniqueInfo.name}`

        const row = [
          // this.linkText(
          //   workaroundTacticLabel,
          //   this.getUrlFromInfoObject(tacticInfo)
          // ),
          { text: i + 1, options: { fontFace: 'Arial', fontSize: 10, align: 'center' } },
          this.linkText(
            workaroundTecniqueLabel,
            this.getUrlFromInfoObject(techniqueInfo)
          ),
          // { text: tacticLabel },
          // { text: techniqueLabel },
          // { text: techniqueInfo.name + '\n' + techniqueId },
          { text: description, options: { fontFace: 'Arial', fontSize: 10 } }
        ]
        rows.push(row)
      }
      // const slide = ppt.addSlide({ masterName: 'Content' })
      //   .addText('Procedure', { placeholder: 'title' })

      ppt.defineSlideMaster({
        title: 'Procedure',
        background: { color: 'FFFFFF' },
        objects: [
          {
            image: {
              x: '5%',
              y: '93%',
              w: 1.2,
              h: 0.18,
              data: MITRE_ATLAS_TM_LOGO()
            }
          },

          {
            text: {
              text: '© 2021 THE MITRE CORPORATION. ALL RIGHTS RESERVED.',
              options: {
                y: '95%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 8,
                color: '0D2F4F'
              }
            }
          }
        ],
        slideNumber: { x: '95%', y: '93%', fontFace: 'Arial', fontSize: 8, color: '0D2F4F' }
      })
      const slide = ppt.addSlide({ masterName: 'Procedure' })
      slide.addText('Procedure', {
        x: 0.5,
        y: 0.5,
        w: '100%',
        h: 1,
        align: 'left',
        valign: 'top',
        fontFace: 'Arial',
        fontSize: 24,
        color: '0D2F4F',
        isTextBox: true
      })

      slide.addTable(rows, {
        y: 1.2,
        colW: [0.5, 2.5, 6],
        w: 9,
        color: '0D2F4F',
        autoPage: true,
        autoPageRepeatHeader: true,
        // autoPageLineWeight: 0.4,
        autoPageCharWeight: -0.2,
        // newSlideStartY: 0.5,
        // verbose: true,
        border: { color: 'D4D4D3' },
        margin: 10
      })
    },
    referenceSlide (ppt, yaml) {
      const slide = ppt.addSlide({ masterName: 'Content' })
        .addText('References', { placeholder: 'title' })

      const texts = []

      yaml.study.references.forEach((ref) => {
        const hasText = 'sourceDescription' in ref && ref.sourceDescription !== null && ref.sourceDescription !== ''
        const hasUrl = 'url' in ref && ref.url !== null && ref.url !== ''

        if (hasText && hasUrl) {
          texts.push({
            text: JSON.parse(JSON.stringify(ref.sourceDescription)),
            options: { hyperlink: { url: ref.url, tooltip: ref.url }, color: '0D2F4F', fontFace: 'Arial', fontSize: 12, bullet: { type: 'number' }, paraSpaceAfter: 10, breakLine: true }
          })
        } else if (hasText) {
          texts.push({
            text: JSON.parse(JSON.stringify(ref.sourceDescription)),
            options: { color: '0D2F4F', fontFace: 'Arial', fontSize: 12, bullet: { type: 'number' }, paraSpaceAfter: 10, breakLine: true }
          })
        } else if (hasUrl) {
          texts.push({
            text: JSON.parse(JSON.stringify(ref.url)),
            options: { hyperlink: { url: ref.url }, color: '0D2F4F', fontFace: 'Arial', fontSize: 12, bullet: { type: 'number' }, paraSpaceAfter: 10, breakLine: true }
          })
        }

        // Add to slide
        slide.addText(
          texts,
          { x: 0.5, y: 1.2, w: 9, h: 4, valign: 'top' }
        )
      })
    }
  }
}
</script>
