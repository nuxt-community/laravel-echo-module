import { setupTest, getNuxt, get, url } from '@nuxt/test-utils'

describe('custom-options-path', () => {
  setupTest({
    server: true,
    fixture: 'fixture/custom-options-path'
  })

  test('onAfterConnect should be defined', async () => {
    const window = await getNuxt().renderAndGetWindow(url('/'))
    expect(window.$nuxt.$echo.options.onAfterConnect).toBeDefined()
  })

  test('render', async () => {
    const { body } = await get('/')
    expect(body).toContain('Works!')
  })
})
