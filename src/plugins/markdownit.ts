import MarkdownIt from 'markdown-it'
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import type { App } from 'vue'

// Initialize Markdown-it with settings and plugins
const markdownit = new MarkdownIt({
    html: true,
    linkify: true
  })
  .use(frontmatterPlugin)

// Adding new rendering rules to apply Vuetify styling
// https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md#adding-new-rules

// Create proxy for rules modification
const proxy = (tokens: any[], idx: number, options: object, env: object, self: any) => self.renderToken(tokens, idx, options);

// Apply Vuetify text styling to paragraph elements
// https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md#reusing-existing-rules
const defaultParagraphOpenRenderer = markdownit.renderer.rules.paragraph_open || proxy;
markdownit.renderer.rules.paragraph_open = function(tokens, idx, options, env, self) {
   // Apply the Vuetify default body text class
   // https://vuetifyjs.com/en/styles/text-and-typography/#typography
   tokens[idx].attrJoin("class", 'text-body-1')
   return defaultParagraphOpenRenderer(tokens, idx, options, env, self)
};


// Apply Vuetify text classes to heading elements
// https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md#reusing-existing-rules
const defaultHeadingOpenRenderer = markdownit.renderer.rules.heading_open || proxy;

markdownit.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
   // Apply the appropriate Vuetify typography class, for ex. `text-h2`
   // https://vuetifyjs.com/en/styles/text-and-typography/#typography
   tokens[idx].attrJoin("class", `text-${tokens[idx].tag}`)
   // Add whitespace
   tokens[idx].attrJoin("class", 'my-5')
   return defaultHeadingOpenRenderer(tokens, idx, options, env, self)
};

// Wrap any HTML tables with Vuetify table classes
// https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md#to-add-a-wrapper-element

const defaultTableOpenRenderer = markdownit.renderer.rules.table_open || proxy;
markdownit.renderer.rules.table_open = (tokens, idx, options, env, self) => {
  return `<div class="v-table v-table--density-default"><div class="v-table__wrapper">${defaultTableOpenRenderer(tokens, idx, options, env, self)}`;
};

const defaultTableCloseRenderer = markdownit.renderer.rules.table_close || proxy;
markdownit.renderer.rules.table_close = (tokens, idx, options, env, self) => {
  return `${defaultTableCloseRenderer(tokens, idx, options, env, self)}</div></div>`;
};

export default {
  install: (app: App) => {
    // Usage in setup:
    //  import { inject } from 'vue'
    //  const md = inject('markdownit')
    app.provide('markdownit', markdownit)
  }
}