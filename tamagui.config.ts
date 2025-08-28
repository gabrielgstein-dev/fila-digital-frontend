import { createTamagui } from '@tamagui/core'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'

const interFont = createInterFont()

const config = createTamagui({
  defaultFont: 'body',
  fonts: {
    heading: interFont,
    body: interFont,
  },
  themes,
  tokens,
  shorthands,
})

export type AppConfig = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
