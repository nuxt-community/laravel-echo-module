import Echo from 'laravel-echo'

<% if (options.broadcaster === 'pusher') { %>
  window.Pusher = require('pusher-js')
    <% } else if (options.broadcaster === 'socket.io') { %>
      window.io = require('socket.io-client')
        <% } %>

          function getHeaders ({ app }) {
            const headers = {}

              <% if (options.authModule) { %>
  if (app.$auth) {
                  const strategy = app.$auth.strategy
                  const tokenName = strategy.options.tokenName || 'Authorization'
                  const token = app.$auth.getToken(strategy.name)

                  if (token) {
                    headers[tokenName] = token
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

    <% if (options.sanctum) { %>
      options.authorizer = function(channel, options) {
        return {
          authorize: (socketId, callback) => {
            ctx.app.$axios.post(options.authEndpoint, {
              socket_id: socketId,
              channel_name: channel.name
            })
              .then(response => {
                callback(false, response.data);
              })
              .catch(error => {
                callback(true, error);
              });
          }
        };
      }
  <% } %>


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
