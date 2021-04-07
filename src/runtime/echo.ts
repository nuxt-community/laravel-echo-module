import BaseEcho from 'laravel-echo'
import defu from 'defu'
import { Context } from '@nuxt/types'
import { ModuleOptions } from './types'

export class Echo extends BaseEcho {
  ctx: Context;
  config: ModuleOptions;

  constructor (ctx: Context, config: Partial<ModuleOptions> = {}) {
    // when enabled authModule, start broadcaster with null
    // because laravel-echo auto connect https://github.com/laravel/echo/blob/master/src/echo.ts#L23
    // the connection should be made only when the user logs in
    super(defu(config.authModule && config.connectOnLogin ? { broadcaster: 'null' } : {}, config))

    this.ctx = ctx
    this.ctx.$config = this.ctx.$config || {} // fallback for Nuxt < 2.13
    this.config = defu(this.ctx.$config.echo || {}, { auth: { headers: {} } }, config)
  }

  async init () {
    this.options.auth = this.options.auth || {}
    this.options.auth.headers = await this.getHeaders()
    this.watchAuthState()
  }

  async getHeaders () {
    let headers = this.config.auth.headers || {}

    if (typeof headers === 'function') {
      headers = await headers(this.ctx)
    }

    if (this.config.authModule && this.ctx.app.$auth) {
      const strategy = this.ctx.app.$auth.strategy

      if (strategy.options.name === 'laravelSanctum') {
        headers.referer = location.origin
        headers.Authorization = 'Bearer' + this.ctx.app.$auth.$storage.getCookies()['XSRF-TOKEN']
      } else {
        const tokenName = strategy.options.token.name || 'Authorization'
        const token = strategy.token.get()

        if (token) {
          headers[tokenName] = token
        }
      }
    }

    return defu(headers, this.options.auth.headers)
  }

  watchAuthState () {
    if (this.config.authModule && this.ctx.app.$auth) {
      this.ctx.app.$auth.$storage.watchState('loggedIn', async (loggedIn: boolean) => {
        this.options.auth.headers = await this.getHeaders()

        if (this.config.connectOnLogin && loggedIn) {
          // set broadcaster when user logged in
          this.options.broadcaster = this.config.broadcaster

          if (this.config.onBeforeConnect) {
            await this.config.onBeforeConnect()
          }

          this.connect()

          if (this.config.onAfterConnect) {
            await this.config.onAfterConnect()
          }
        }

        if (this.config.disconnectOnLogout && !loggedIn && this.connector) {
          if (this.config.onBeforeDisconnect) {
            await this.config.onBeforeDisconnect()
          }

          this.disconnect()

          if (this.config.onAfterDisconnect) {
            await this.config.onAfterDisconnect()
          }
        }
      }).bind(this)
    }
  }
}
