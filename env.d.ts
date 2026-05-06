/// <reference types="vite/client" />

import { VBtn } from 'vuetify/components'

declare module 'vue' {
  export interface GlobalComponents {
    VAtlasBtnPrimary: typeof VBtn
    VAtlasBtnSecondary: typeof VBtn
  }
}
