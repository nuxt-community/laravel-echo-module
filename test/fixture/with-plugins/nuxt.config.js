module.exports = {
  rootDir: __dirname,
  buildModules: [
    { handler: require('../../../') }
  ],
  echo: {
    plugins: [
      '~/plugins/echo.js'
    ]
  }
}
