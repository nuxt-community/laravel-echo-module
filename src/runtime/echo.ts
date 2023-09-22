import BaseEcho from 'laravel-echo'
import defu from 'defu'
import { Context } from '@nuxt/types'
import { ModuleOptions } from './types'

export class Echo extends BaseEcho {
  ctx: Context;

  constructor (ctx: Context, options: Partial<ModuleOptions> = {}) {
    super(defu((ctx.$config || {}).echo || {}, options))

    this.ctx = ctx
    this.options.auth = this.options.auth || {}
  }

  async init () {
    this.options.auth.headers = await this.getHeaders()
    this.watchAuthState()
  }

  async getHeaders () {
    let headers: any = {}

    if (typeof headers === 'function') {
      headers = await headers(this.ctx)
    }

    if (this.options.authModule && this.ctx.app.$auth) {
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

  async connect () {
    if (this.options.onBeforeConnect) {
      await this.options.onBeforeConnect().bind(this)
    }

    super.connect()

    if (this.options.onAfterConnect) {
      await this.options.onAfterConnect().bind(this)
    }
  }

  async disconnect () {
    if (this.options.onBeforeDisconnect) {
      await this.options.onBeforeDisconnect().bind(this)
    }

    super.disconnect()

    if (this.options.onAfterDisconnect) {
      await this.options.onAfterDisconnect().bind(this)
    }
  }

  watchAuthState () {
    if (this.options.authModule && this.ctx.app.$auth) {
      this.ctx.app.$auth.$storage.watchState('loggedIn', async (loggedIn: boolean) => {
        this.options.auth.headers = await this.getHeaders()

        if (this.options.connectOnLogin && loggedIn) {
          await this.connect()
        }

        if (this.options.disconnectOnLogout && !loggedIn && this.connector) {
          await this.disconnect()
        }
      }).bind(this)
    }
  }
}
