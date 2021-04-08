import { setupTest, getNuxt, get, url } from '@nuxt/test-utils'

describe('options-path', () => {
  setupTest({
    server: true,
    fixture: 'fixture/options-path'
  })

  test('onBeforeConnect should be defined', async () => {
    const window = await getNuxt().renderAndGetWindow(url('/'))
    expect(window.$nuxt.$echo.options.onBeforeConnect).toBeDefined()
  })

  test('render', async () => {
    const { body } = await get('/')
    expect(body).toContain('Works!')
  })
})
