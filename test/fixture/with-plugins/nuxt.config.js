module.exports = {
  rootDir: __dirname,
  render: {
    resourceHints: false
  },
  buildModules: [
    { handler: require('../../../') }
  ],
  echo: {
    plugins: [ '~/plugins/echo.js' ]
  }
}
