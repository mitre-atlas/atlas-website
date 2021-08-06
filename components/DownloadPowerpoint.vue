<template>
  <v-btn
    v-if="isBuilder"
    class="my-5"
    outlined
    x-large
    v-on="on"
    @click="makePPT"
  >
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
      const slide = ppt.addSlide({ masterName: 'MASTER_SLIDE' })
      slide.addText([
        { text: yaml.study.name }
      ],
      {
        x: 0,
        y: '25%',
        w: '100%',
        h: 2.5,
        valign: 'middle',
        align: 'center',
        color: '0D2F4F',
        fill: '87DEFF',
        fontSize: 48
      })
      slide.addImage({
        data: MITRE_ATLAS_TM_LOGO(),
        x: 6.75,
        y: 5,
        h: 0.4,
        w: 3
      })
    },
    detailSlide (ppt, yaml) {
      const slide = ppt.addSlide()
      slide.addText([
        { text: 'Case Study Details' }
      ],
      {
        x: 0,
        y: 0,
        w: '100%',
        h: 1,
        color: 'FFFFFF',
        fill: '0D2F4F',
        fontSize: 30
      })
      slide.addText([
        { text: 'Summary:', options: { color: '0D2F4F', breakLine: true, fontSize: 24 } },
        { text: yaml.study.summary, options: { color: '0D2F4F', breakLine: true, fontSize: 18, indentLevel: 1 } }
      ],
      {
        y: 2.5
      })
      slide.addText([
        { text: 'Reported By: ', options: { color: '0D2F4F', fontSize: 18 } },
        { text: yaml.study['reported-by'], options: { color: '0D2F4F', fontSize: 18 } }
      ],
      {
        y: '80%'
      })
      slide.addText([
        { text: 'Date: ', options: { color: '0D2F4F', fontSize: 18 } },
        { text: yaml.study['incident-date'], options: { color: '0D2F4F', fontSize: 18 } }
      ],
      {
        y: '90%'
      })
    },
    procedureSlide (ppt, yaml) {
      const rows = [[
        { text: 'Tactic', options: { fill: '87DEFF', color: '0D2F4F', align: 'center', bold: true } },
        { text: 'Technique', options: { fill: '87DEFF', color: '0D2F4F', align: 'center', bold: true } },
        { text: 'Description', options: { fill: '87DEFF', color: '0D2F4F', align: 'center', bold: true } }
      ]]
      for (let i = 0; i < yaml.study.procedure.length; i++) {
        const tactic = this.$store.getters.getTacticById(yaml.study.procedure[i].tactic)
        const technique = this.$store.getters.getTechniqueById(yaml.study.procedure[i].technique)
        const r = [tactic.name + '\n' + yaml.study.procedure[i].tactic, technique.name + '\n' + yaml.study.procedure[i].technique, yaml.study.procedure[i].description]
        rows.push(r)
      }
      const slide = ppt.addSlide()
      slide.addText([
        { text: 'Procedure' }
      ],
      {
        x: 0,
        y: 0,
        w: '100%',
        h: 1,
        color: 'FFFFFF',
        fill: '0D2F4F',
        fontSize: 30
      })
      slide.addTable(rows,
        {
          y: 1.5,
          colW: [2, 2, 5],
          w: 9,
          color: '0D2F4F',
          autoPage: true,
          autoPageRepeatHeader: true,
          border: { color: '0D2F4F' },
          margin: 10
        })
    },
    referenceSlide (ppt, yaml) {
      let i = 0
      while (i < yaml.study.references.length) {
        const lim = i + 5 > yaml.study.references.length ? yaml.study.references.length : i + 5
        const slide = ppt.addSlide()
        slide.addText([
          { text: 'References' }
        ],
        {
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
            slide.addText([
              { text: yaml.study.references[i].sourceDescription }
            ], { y: '' + y + '%', color: '0D2F4F', fontSize: 22 })
            if (yaml.study.references[i].url) { y += 5 }
          }
          if (yaml.study.references[i].url) {
            slide.addText([
              { text: yaml.study.references[i].url, options: { hyperlink: { url: yaml.study.references[i].url } } }
            ], { y: '' + y + '%', color: '0D2F4F', fontSize: 22 })
          }
          y += 15
          i++
        }
      }
    }
  }
}
</script>
