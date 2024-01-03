import Pptxgen from 'pptxgenjs'
import { MITRE_ATLAS_TM_LOGO } from '@/assets/base64_atlas_logo'
import { formatCaseStudyIncidentDate } from '@/assets/tools.js'

/**
 * Makes powerpoint using the study information.
 * @param {Object} study
 * @param {String} filename
 */
export function makePPT (study, filename) {
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

  titleSlide(ppt, study)
  detailSlide(ppt, study)
  procedureSlide(ppt, study)
  // Create reference slide if references exist
  if (Array.isArray(study.references) && study.references.length > 0) {
    referenceSlide(ppt, study)
  }

  // Use case study title if no argument provided
  if (typeof filename === 'undefined') {
    filename = study.name
  }

  ppt.writeFile({ fileName: `${filename}.pptx` })
}


/**
 * Builds the title slide using the yaml
 * @param {Pptxgen} ppt
 * @param {Object} yaml
 */
function titleSlide (ppt, yaml) {
  let textLabel = 'ATLAS Case Study'
  if (yaml['case-study-type']) {
    const type = yaml['case-study-type']
    textLabel += ' - ' + type.slice(0, 1).toUpperCase() + type.slice(1, type.length)
  }
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
          text: textLabel,
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
            name: 'involved',
            type: 'body',
            y: '88%',
            w: '100%',
            align: 'center',
            fontFace: 'Arial',
            fontSize: 14,
            color: '0D2F4F',
            isTextBox: true
          },
          text: 'Target | Actor | Reporter'
        }
      }
    ]
  })

  // Convert incident date to a locale date string,
  // depending on specified date granularity
  const formattedDate = formatCaseStudyIncidentDate(yaml)

  // Workaround for erroneous list item, TBD removal
  let reporter = yaml.reporter
  if (Array.isArray(reporter)) {
    reporter = reporter[0]
  }

  ppt
    .addSlide({ masterName: 'Title' })
    .addText(yaml.name, { placeholder: 'title' })
    .addText(
      [
        {
          text: 'Actor: '
        },
        {
          text: yaml.actor ? yaml.actor : 'Unknown',
          options: {
            bold: true
          }
        },
        {
          text: ' | Target: '
        },
        {
          text: yaml.target ? yaml.target : 'Unknown',
          options: {
            bold: true
          }
        },
        {
          text: yaml.reporter ? ' | Reporter: ' : ''
        },
        {
          text: yaml.reporter ? yaml.reporter : '',
          options: {
            bold: true
          }
        }
      ],
      {
        placeholder: 'involved'
      }
    )
    .addText(formattedDate, { placeholder: 'incidentDate' })
}


/**
 * Adds a summary slide using the yaml
 * @param {Pptxgen} ppt
 * @param {Object} yaml
 */
function detailSlide (ppt, yaml) {
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
}


/**
 * Gets the url from from some object type
 * @param {Object} infoObject
 * @returns {String}
 */
function getUrlFromInfoObject (infoObject) {
  const baseUrl = window.location.origin
  return `${baseUrl}/${infoObject['object-type']}s/${infoObject.id}`
}



/**
 * Links text to a given url
 * @param {String} text
 * @param {String} url
 * @returns {Object}
 */
function linkText (text, url) {
  return { text, options: { hyperlink: { url }, fontFace: 'Arial', fontSize: 10 } }
}


/**
 * Builds procedure slides using the yaml
 * @param {Pptxgen} ppt
 * @param {Object} yaml
 */
function procedureSlide (ppt, yaml) {
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
    const description = yaml.procedure[i].description
    const techniqueInfo = yaml.procedure[i].techniqueObject

    const row = [
      { text: i + 1, options: { fontFace: 'Arial', fontSize: 10, align: 'center' } },
      linkText(
        techniqueInfo.label,
        getUrlFromInfoObject(techniqueInfo)
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
  // the latest pptxgenjs errors here, need to revert to 3.7.1 to work. Issue below:
  // https://github.com/gitbrent/PptxGenJS/issues/1005
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
}



/**
 * Builds the reference slides using the yaml
 * @param {Pptxgen} ppt
 * @param {Object} yaml
 */
function referenceSlide (ppt, yaml) {
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