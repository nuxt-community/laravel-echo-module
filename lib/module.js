const { resolve } = require('path')

module.exports = function (moduleOptions) {
  this.nuxt.hook('builder:extendPlugins', (plugins) => {
    const options = {
      auth: {
        headers: {}
      },
      authEndpoint: '/broadcasting/auth',
      broadcaster: 'null',
      host: null,
      key: null,
      namespace: 'App.Events',
      plugins: null,
      authModule: false,
      connectOnLogin: true,
      disconnectOnLogout: true,
      ...this.options.echo,
      ...moduleOptions
    }

    // Copy echo plugin
    const { dst } = this.addTemplate({
      src: resolve(__dirname, 'plugin.js'),
      fileName: 'echo.js',
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

module.exports.meta = require('../package.json')
