import { resolve } from 'path'
import defu from 'defu'
import { Module } from '@nuxt/types'
import { NuxtOptionsPlugin } from '@nuxt/types/config/plugin'
import { name, version } from '../package.json'

const CONFIG_KEY = 'echo'

export interface ModuleOptions {
  broadcaster?: string,
  plugins?: string[],
  authModule?: boolean,
  connectOnLogin?: boolean,
  disconnectOnLogout?: boolean,
}

const DEFAULTS: ModuleOptions = {
  broadcaster: 'null',
  authModule: false,
  connectOnLogin: true,
  disconnectOnLogout: true
}

const nuxtModule: Module<ModuleOptions> = function (moduleOptions) {
  this.nuxt.hook('builder:extendPlugins', (plugins: NuxtOptionsPlugin[]) => {
    const options: ModuleOptions = defu(
      this.options[CONFIG_KEY] || {},
      moduleOptions,
      DEFAULTS
    )

    // Copy echo plugin
    const { dst } = this.addTemplate({
      src: resolve(__dirname, '../templates/plugin.js'),
      fileName: `${CONFIG_KEY}.js`,
      options
    })

    plugins.push({
      ssr: false,
      src: resolve(this.options.buildDir, dst)
    })

    // Extend echo with plugins
    if (options.plugins) {
      options.plugins.forEach(p => plugins.push({
        ssr: false,
        src: p
      }))

      delete options.plugins
    }
  })
}

;(nuxtModule as any).meta = { name, version }

declare module '@nuxt/types' {
  interface NuxtConfig { [CONFIG_KEY]?: ModuleOptions } // Nuxt 2.14+
  interface Configuration { [CONFIG_KEY]?: ModuleOptions } // Nuxt 2.9 - 2.13
}

export default nuxtModule
