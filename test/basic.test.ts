import { setupTest, getNuxt, get, url } from '@nuxt/test-utils'

describe('basic', () => {
  setupTest({
    server: true,
    fixture: 'fixture/basic'
  })

  test('echo should be defined', async () => {
    const window = await getNuxt().renderAndGetWindow(url('/'))
    expect(window.$nuxt.$echo).toBeDefined()
  })

  test('render', async () => {
    const { body } = await get('/')
    expect(body).toContain('Works!')
  })
})
