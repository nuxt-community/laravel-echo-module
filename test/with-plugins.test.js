const { setup, loadConfig, get, url } = require('@nuxtjs/module-test-utils')

describe('with-plugins', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'with-plugins'))))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('echo plugin should be defined', async () => {
    const window = await nuxt.renderAndGetWindow(url('/'))
    expect(window.$nuxt.$echo).toBeDefined()
    expect(window.$nuxt.$echo.plugin).toBe(true)
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
  })
})
