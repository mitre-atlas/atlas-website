<template>
  <v-btn v-if="isBuilder" color="secondary" v-on="on" @click="makePPT">
    <v-icon left>
      mdi-download
    </v-icon>
    Download Powerpoint
  </v-btn>
  <v-btn
    v-else
    elevation="0"
    color="inherit"
    v-bind="attrs"
    v-on="on"
    @click="makePPT"
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
      isBuilder: this.builder
    }
  },
  methods: {
    makePPT () {
      const ppt = new Pptxgen()
      ppt.layout = 'LAYOUT_16x9'

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

      ppt.writeFile({ fileName: `${this.studyYaml.study.name}-PPT.pptx` })
    },
    titleSlide (ppt, yaml) {
      ppt.defineSlideMaster({
        title: 'Title',
        background: { color: 'FFFFFF' },
        objects: [
          {
            image: {
              x: '45%',
              y: '10%',
              w: 1.2,
              h: 0.18,
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
                isTextBox: true
              }
            }
          },

          {
            placeholder: {
              options: {
                name: 'incidentDate',
                type: 'incidentDate',
                y: '82%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 14,
                isTextBox: true
              },
              text: 'Incident Date'
            }
          },
          {
            placeholder: {
              options: {
                name: 'reportedBy',
                type: 'reportedBy',
                y: '88%',
                w: '100%',
                align: 'center',
                fontFace: 'Arial',
                fontSize: 14,
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
        yaml.study.dateGranularity == null ||
        yaml.study.dateGranularity === 'DATE'
      ) {
        // If dateGranularity is DATE, or there is no date granularity
        formattedDate = yaml.study['incident-date'].toLocaleDateString(
          'default',
          { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }
        )
      }

      ppt
        .addSlide({ masterName: 'Title' })
        .addText(yaml.study.name, { placeholder: 'title' })
        .addText(yaml.study['reported-by'], { placeholder: 'reportedBy' })
        .addText(formattedDate, { placeholder: 'incidentDate' })
      // const slide = ppt.addSlide({ masterName: 'MASTER_SLIDE' })
      // slide.addText([
      //   { text: yaml.study.name }
      // ],
      // {
      //   x: 0,
      //   y: '25%',
      //   w: '100%',
      //   h: 2.5,
      //   valign: 'middle',
      //   align: 'center',
      //   color: '0D2F4F',
      //   fill: '87DEFF',
      //   fontSize: 48
      // })
      // slide.addImage({
      //   data: MITRE_ATLAS_TM_LOGO(),
      //   x: 6.75,
      //   y: 5,
      //   h: 0.4,
      //   w: 3
      // })
    },
    detailSlide (ppt, yaml) {
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
                isTextBox: true
              },
              text: 'Title'
            }
          },
          {
            placeholder: {
              options: {
                name: 'content',
                type: 'content',
                x: 0.5,
                y: 1.5,
                w: 9,
                h: 6,
                align: 'left',
                fontFace: 'Arial',
                fontSize: 16,
                isTextBox: true
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
                fontSize: 8
              }
            }
          }
        ],
        slideNumber: { x: '95%', y: '93%', fontFace: 'Arial', fontSize: 8 }
      })

      ppt.addSlide({ masterName: 'Content' })
        .addText('Summary', { placeholder: 'title' })
        .addText(yaml.study.summary, { placeholder: 'content' })
      // const slide = ppt.addSlide()
      // slide.addText([{ text: 'Case Study Details' }], {
      //   x: 0,
      //   y: 0,
      //   w: '100%',
      //   h: 1,
      //   color: 'FFFFFF',
      //   fill: '0D2F4F',
      //   fontSize: 30
      // })
      // slide.addText(
      //   [
      //     {
      //       text: 'Summary:',
      //       options: { color: '0D2F4F', breakLine: true, fontSize: 24 }
      //     },
      //     {
      //       text: yaml.study.summary,
      //       options: {
      //         color: '0D2F4F',
      //         breakLine: true,
      //         autoFit: true,
      //         indentLevel: 1
      //       }
      //     }
      //   ],
      //   {
      //     y: 2.5
      //   }
      // )
      // slide.addText(
      //   [
      //     { text: 'Reported By: ', options: { color: '0D2F4F', fontSize: 18 } },
      //     {
      //       text: yaml.study['reported-by'],
      //       options: { color: '0D2F4F', fontSize: 18 }
      //     }
      //   ],
      //   {
      //     y: '80%'
      //   }
      // )
      // slide.addText(
      //   [
      //     { text: 'Date: ', options: { color: '0D2F4F', fontSize: 18 } },
      //     {
      //       text: yaml.study['incident-date'].toISOString().substr(0, 10),
      //       options: { color: '0D2F4F', fontSize: 18 }
      //     }
      //   ],
      //   {
      //     y: '90%'
      //   }
      // )
    },
    getUrlFromInfoObject (infoObject) {
      const baseUrl = window.location.origin
      return `${baseUrl}/${infoObject['object-type']}s/${infoObject.id}`
    },
    linkText (text, url) {
      return { text, options: { hyperlink: { url } } }
    },
    procedureSlide (ppt, yaml) {
      const rows = [
        [
          {
            text: 'Tactic',
            options: {
              fill: '87DEFF',
              color: '0D2F4F',
              align: 'center',
              bold: true
            }
          },
          {
            text: 'Technique',
            options: {
              fill: '87DEFF',
              color: '0D2F4F',
              align: 'center',
              bold: true
            }
          },
          {
            text: 'Description',
            options: {
              fill: '87DEFF',
              color: '0D2F4F',
              align: 'center',
              bold: true
            }
          }
        ]
      ]
      for (let i = 0; i < yaml.study.procedure.length; i++) {
        const tacticId = yaml.study.procedure[i].tactic
        const techniqueId = yaml.study.procedure[i].technique
        const description = yaml.study.procedure[i].description

        const tacticInfo = this.$store.getters.getTacticById(tacticId)
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

        const workaroundTacticLabel = `${tacticInfo.name}\n${tacticId}`
        const workaroundTecniqueLabel = `${techniqueInfo.name}\n${techniqueId}`

        const row = [
          this.linkText(
            workaroundTacticLabel,
            this.getUrlFromInfoObject(tacticInfo)
          ),
          this.linkText(
            workaroundTecniqueLabel,
            this.getUrlFromInfoObject(techniqueInfo)
          ),
          // { text: tacticLabel },
          // { text: techniqueLabel },
          // { text: techniqueInfo.name + '\n' + techniqueId },
          { text: description }
        ]
        rows.push(row)
      }
      const slide = ppt.addSlide()
      slide.addText([{ text: 'Procedure' }], {
        x: 0,
        y: 0,
        w: '100%',
        h: 1,
        color: 'FFFFFF',
        fill: '0D2F4F',
        fontSize: 30
      })
      slide.addTable(rows, {
        y: 1.5,
        colW: [2, 2, 5],
        w: 9,
        color: '0D2F4F',
        autoPage: true,
        autoPageRepeatHeader: true,
        // verbose: true,
        border: { color: '0D2F4F' },
        margin: 10
      })
    },
    referenceSlide (ppt, yaml) {
      let i = 0
      while (i < yaml.study.references.length) {
        const lim =
          i + 5 > yaml.study.references.length
            ? yaml.study.references.length
            : i + 5
        const slide = ppt.addSlide()
        slide.addText([{ text: 'References' }], {
          x: 0,
          y: 0,
          w: '100%',
          h: 1,
          color: 'FFFFFF',
          fill: '0D2F4F',
          fontSize: 30
        })
        let y = 30
        while (i < lim) {
          if (yaml.study.references[i].sourceDescription) {
            slide.addText(
              [{ text: yaml.study.references[i].sourceDescription }],
              { y: '' + y + '%', color: '0D2F4F', fontSize: 22 }
            )
            if (yaml.study.references[i].url) {
              y += 5
            }
          }
          if (yaml.study.references[i].url) {
            slide.addText(
              [
                {
                  text: yaml.study.references[i].url,
                  options: { hyperlink: { url: yaml.study.references[i].url } }
                }
              ],
              { y: '' + y + '%', color: '0D2F4F', fontSize: 22 }
            )
          }
          y += 15
          i++
        }
      }
    }
  }
}
</script>
