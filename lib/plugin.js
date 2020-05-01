import Echo from 'laravel-echo'

<% if (options.broadcaster === 'pusher') { %>
window.Pusher = require('pusher-js')
<% } else if (options.broadcaster === 'socket.io') { %>
window.io = require('socket.io-client')
<% } %>

function getHeaders ({ app }) {
  const headers = {
    referer: location.origin
  }

  <% if (options.authModule) { %>
  if (app.$auth) {
    const strategy = app.$auth.strategy

    if (strategy.options.name === 'laravelSanctum') {
      headers['X-XSRF-TOKEN'] = app.$auth.$storage.getCookies()['XSRF-TOKEN']
    } else {
      const tokenName = strategy.options.token.name || 'Authorization'
      const token = app.$auth.token.get()

      if (token) {
        headers[tokenName] = token
      }
    }
  }
  <% } %>

  return headers
}

export default (ctx, inject) => {
  const options = <%= serialize(options) %>
  options.auth = options.auth || {}
  options.auth.headers = {
    ...options.auth.headers,
    ...getHeaders(ctx)
  }

  const echo = new Echo(options)

  <% if (options.authModule) { %>
  if (ctx.app.$auth) {
    ctx.app.$auth.$storage.watchState('loggedIn', loggedIn => {
      echo.options.auth.headers = {
        ...echo.options.auth.headers,
        ...getHeaders(ctx)
      }

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
