import { resolve, join } from 'path'
import { existsSync } from 'fs'
import defu from 'defu'
import { Module } from '@nuxt/types'
import { NuxtOptionsPlugin } from '@nuxt/types/config/plugin'
import { name, version } from '../package.json'
import { ModuleOptions } from './runtime/types'

const DEFAULTS: ModuleOptions = {
  broadcaster: 'null',
  encrypted: false,
  authModule: false,
  connectOnLogin: true,
  disconnectOnLogout: true
}

const nuxtModule: Module<ModuleOptions> = function (moduleOptions) {
  this.nuxt.hook('builder:extendPlugins', (plugins: NuxtOptionsPlugin[]) => {
    const options = defu(
      this.options.echo || {},
      moduleOptions,
      DEFAULTS
    )

    const runtimeDir = resolve(__dirname, 'runtime')
    this.options.alias['~echo'] = runtimeDir
    this.options.build.transpile.push(runtimeDir, 'laravel-echo', 'defu')

    const optionsPath: string = this.nuxt.resolver.resolveAlias(options.optionsPath ||
      join(this.options.dir!.app || 'app', 'laravel-echo', 'options.js'))

    // Register options template
    this.addTemplate({
      fileName: `laravel-echo/options.${optionsPath && optionsPath.endsWith('ts') ? 'ts' : 'js'}`,
      src: existsSync(optionsPath) ? optionsPath : resolve(__dirname, './runtime/options.js'),
      options
    })

    // Copy echo plugin
    const { dst } = this.addTemplate({
      src: resolve(__dirname, './runtime/plugin.js'),
      fileName: 'laravel-echo/plugin.js',
      options: {
        broadcaster: options.broadcaster,
        encrypted: options.encrypted
      }
    })

    plugins.push({
      src: resolve(this.options.buildDir, dst),
      ssr: false
    })

    // Extend echo with plugins
    if (options.plugins) {
      options.plugins.forEach(p => plugins.push({ src: p, ssr: false }))

      delete options.plugins
    }
  })
}

;(nuxtModule as any).meta = { name, version }

export default nuxtModule
