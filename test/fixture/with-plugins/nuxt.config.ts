import { NuxtConfig } from '@nuxt/types'

export default <NuxtConfig> {
  buildModules: [
    '@nuxt/typescript-build',
    '../../../src/module.ts'
  ],
  echo: {
    plugins: [
      '~/plugins/echo.js'
    ]
  }
}
