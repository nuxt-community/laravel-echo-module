export default {
  buildModules: [
    '@nuxtjs/laravel-echo'
  ],

  serverMiddleware: [
    { path: '/pusher', handler: '~/server-middleware/pusher.js' }
  ],

  echo: {
    broadcaster: 'pusher',
    key: process.env.PUSHER_KEY,
    cluster: process.env.PUSHER_CLUSTER
  }
}
