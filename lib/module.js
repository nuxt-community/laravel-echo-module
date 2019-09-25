const { resolve } = require('path')

module.exports = function (moduleOptions) {
  const options = {
    authModule: false,
    connectOnLogin: true,
    disconnectOnLogout: true,
    ...this.options.echo,
    ...moduleOptions
  }

  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'echo.js',
    options
  })
}

module.exports.meta = require('../package.json')
