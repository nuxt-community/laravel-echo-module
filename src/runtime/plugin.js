import options from './options'
import { Echo } from '~echo'

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default async function (ctx, inject) {
  const echoOptions = typeof options === 'function' ? await options(ctx) : options

  <% if (options.broadcaster === 'pusher' && !options.encrypted) { %>
  if (!window.Pusher) window.Pusher = require('pusher-js')
  <% } %>

  <% if (options.broadcaster === 'pusher' && options.encrypted) { %>
  if (!window.Pusher) window.Pusher = require('pusher-js/with-encryption')
  <% } %>

  <% if (options.broadcaster === 'socket.io') { %>
  if (!window.io) window.io = require('socket.io-client')
  <% } %>

  const echo = new Echo(ctx, echoOptions)
  await echo.init()

  inject('echo', echo)
  ctx.$echo = echo
}
