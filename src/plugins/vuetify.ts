// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

// Default colors + mitre brand colors
const mainTheme = {
  dark: false,
  colors: {
    header: '#424242',
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#424242',
    secondary: '#4957b2',
    error: '#b00020',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#fb8c00',
    bruhus: '#fb8c00',
    blue: '#005B94',
    highlighter: '#FFF601',
    darkNavy: '#0B2338',
    navy: '#0D2F4F',
    lightBlue: '#87DEFF',
    darkGray: '#7E8284',
    silver: '#D4D4D3',
    lightSilver: '#F1F3F4',
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'mainTheme',
    themes: {
      mainTheme,
    }
  },
  display: {
    mobileBreakpoint: 'sm',
  }
})
