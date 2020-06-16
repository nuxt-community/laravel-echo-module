import Echo from 'laravel-echo'

<% if (options.broadcaster === 'pusher') { %>
window.Pusher = require('pusher-js')
<% } else if (options.broadcaster === 'socket.io') { %>
window.io = require('socket.io-client')
<% } %>

async function getHeaders (ctx, headers = {}) {
  if (typeof headers === 'function') {
    headers = await headers(ctx)
  }

  const result = {
    ...headers
  }

  <% if (options.authModule) { %>
  if (ctx.app.$auth) {
    const strategy = ctx.app.$auth.strategy
    const tokenName = strategy.options.tokenName || 'Authorization'
    const token = ctx.app.$auth.getToken(strategy.name)

    if (token) {
      result[tokenName] = token
    }
  }
  <% } %>

  return result
}

export default async (ctx, inject) => {
  const options = <%= serialize(options) %>
  options.auth = options.auth || {}
  options.auth.headers = await getHeaders(ctx, options.auth.headers || {})

  const echo = new Echo(options)

  <% if (options.authModule) { %>
  if (ctx.app.$auth) {
    ctx.app.$auth.$storage.watchState('loggedIn', async loggedIn => {
      echo.options.auth.headers = await getHeaders(ctx, echo.options.auth.headers)

      <% if (options.connectOnLogin) { %>
      if (loggedIn) {
        echo.connect()
      }
      <% } %>

      <% if (options.disconnectOnLogout) { %>
      if (!loggedIn && echo.connector) {
        echo.disconnect()
      }
      <% } %>
    })
  }
  <% } %>

  ctx.$echo = echo
  inject('echo', echo)
}
