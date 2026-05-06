// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components'

// Default colors + mitre brand colors
const mainTheme = {
  dark: false,
  colors: {
    header: '#424242',
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#1BB0E6',
    primaryHover: '#11759A',
    secondary: '#4957b2',
    error: '#b00020',
    info: '#1BB0E6',
    darkInfo: '#179ECF',
    success: '#4caf50',
    warning: '#fb8c00',
    bruhus: '#fb8c00',
    blue: '#005B94',
    highlighter: '#FFF601',
    lightNavy: '#2D4862',
    mediumNavy: '#0E2F4F',
    darkNavy: '#0B2338',
    navy: '#0D2F4F',
    lightBlue: '#87DEFF',
    backgroundBlue: '#edf6fa',
    darkGray: '#7E8284',
    silver: '#D4D4D3',
    lightSilver: '#F1F3F4'
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  aliases: {
    VAtlasBtnPrimary: VBtn,
    VAtlasBtnSecondary: VBtn,
  },
  defaults: {
    VAtlasBtnPrimary: {
      color: 'primary',
      variant: 'flat',
      class: 'atlas-btn-primary text-none',
    },
    VAtlasBtnSecondary: {
      color: 'primary',
      variant: 'outlined',
      class: 'atlas-btn-secondary text-none',
    },
  },
  theme: {
    defaultTheme: 'mainTheme',
    themes: {
      mainTheme
    }
  },
  display: {
    mobileBreakpoint: 'sm'
  }
})
