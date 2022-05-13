<template>
  <v-row v-if="isBuilder" align="start">
    <v-container>
      <v-checkbox
        v-model="pptCheckbox"
        label="Also download as PowerPoint"
        elevation="0"
        color="inherit"
        @change="changeCheckbox"
      />
    </v-container>
  </v-row>
  <v-list-item
    v-else
    color="inherit"
    v-bind="attrs"
    v-on="on"
    @click="makePPT()"
  >
    <v-list-item-icon style="margin-right: 0px;">
      <v-icon small>
        mdi-arrow-collapse-down
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>
        Download as Powerpoint (.pptx)
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
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
              text: '© 2022 THE MITRE CORPORATION. ALL RIGHTS RESERVED.',
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

      this.titleSlide(ppt, this.studyYaml)
      this.detailSlide(ppt, this.studyYaml)
      this.procedureSlide(ppt, this.studyYaml)
      if (this.studyYaml.references) {
        this.referenceSlide(ppt, this.studyYaml)
      }

      // Use case study title if no argument provided
      if (typeof filename === 'undefined') {
        filename = this.studyYaml.name
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
      let dateGranularity = yaml['incident-date-granularity']
      // Handle existing individual case studies with previous key
      if ('dateGranularity' in yaml) {
        dateGranularity = yaml.dateGranularity
      }
      if (dateGranularity === 'YEAR') {
        formattedDate = yaml['incident-date'].toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric' }
        )
      } else if (dateGranularity === 'MONTH') {
        formattedDate = yaml['incident-date'].toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long' }
        )
      } else if (
        dateGranularity === undefined ||
        dateGranularity === 'DATE'
      ) {
        // If dateGranularity is DATE, or there is no date granularity
        formattedDate = yaml['incident-date'].toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
        )
      }

      // Workaround for erroneous list item, TBD removal
      let reportedBy = yaml['reported-by']
      if (Array.isArray(reportedBy)) {
        reportedBy = reportedBy[0]
      }

      ppt
        .addSlide({ masterName: 'Title' })
        .addText(yaml.name, { placeholder: 'title' })
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
              text: '© 2022 THE MITRE CORPORATION. ALL RIGHTS RESERVED.',
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
        .addText(yaml.summary, { placeholder: 'content' })
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
      for (let i = 0; i < yaml.procedure.length; i++) {
        const techniqueId = yaml.procedure[i].technique
        const description = yaml.procedure[i].description

        const techniqueInfo = this.$store.getters.getDataObjectById(techniqueId)

        const parentTechnique = this.$store.getters['subtechnique/getParent'](techniqueInfo)

        let workaroundTechniqueLabel = null
        if (parentTechnique) {
          workaroundTechniqueLabel = `${parentTechnique.name}: ${techniqueInfo.name}`
        } else {
          workaroundTechniqueLabel = `${techniqueInfo.name}`
        }

        const row = [
          { text: i + 1, options: { fontFace: 'Arial', fontSize: 10, align: 'center' } },
          this.linkText(
            workaroundTechniqueLabel,
            this.getUrlFromInfoObject(techniqueInfo)
          ),
          { text: description, options: { fontFace: 'Arial', fontSize: 10 } }
        ]
        rows.push(row)
      }

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
              text: '© 2022 THE MITRE CORPORATION. ALL RIGHTS RESERVED.',
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
        y: 1,
        colW: [0.5, 2.6, 5.7],
        w: 11,
        color: '0D2F4F',
        autoPage: true,
        autoPageRepeatHeader: true,
        autoPageLineWeight: -0.2,
        autoPageCharWeight: -0.2,
        newSlideStartY: 0.4,
        // verbose: true,
        border: { color: 'D4D4D3' },
        margin: 10
      })
    },
    referenceSlide (ppt, yaml) {
      const slide = ppt.addSlide({ masterName: 'Content' })
        .addText('References', { placeholder: 'title' })

      const texts = []

      yaml.references.forEach((ref) => {
        const hasText = 'title' in ref && ref.title !== null && ref.title !== ''
        const hasUrl = 'url' in ref && ref.url !== null && ref.url !== ''

        if (hasText && hasUrl) {
          texts.push({
            text: JSON.parse(JSON.stringify(ref.title)),
            options: { hyperlink: { url: ref.url, tooltip: ref.url }, color: '0D2F4F', fontFace: 'Arial', fontSize: 12, bullet: { type: 'number' }, paraSpaceAfter: 10, breakLine: true }
          })
        } else if (hasText) {
          texts.push({
            text: JSON.parse(JSON.stringify(ref.title)),
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
