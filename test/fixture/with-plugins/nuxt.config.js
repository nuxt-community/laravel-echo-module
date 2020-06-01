module.exports = {
  rootDir: __dirname,
  render: {
    resourceHints: false
  },
  buildModules: [
    { handler: require('../../../') }
  ],
  echo: {
    sanctum: true,
    plugins: ['~/plugins/echo.js']
  }
}
