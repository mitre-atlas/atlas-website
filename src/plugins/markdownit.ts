import MarkdownIt from 'markdown-it'
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import type { App } from 'vue'

// Initialize Markdown-it with settings and plugins
const markdownit = new MarkdownIt({
    html: true,
    linkify: true
  })
  .use(frontmatterPlugin)

// TODO Adding new rendering rules for Vuetify styling
// https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md#adding-new-rules
// markdownit.renderer.rules.table_open = () => '<v-table>'
// markdownit.renderer.rules.table_close = () => '</v-table>'

export default {
  install: (app: App) => {
    // Usage in setup:
    //  import { inject } from 'vue'
    //  const md = inject('markdownit')
    app.provide('markdownit', markdownit)
  }
}