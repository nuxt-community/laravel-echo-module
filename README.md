# @nuxtjs/laravel-echo

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Laravel Echo for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Requirements

If you use the broadcaster `pusher`, you need to ensure that you have `pusher-js` installed:

```bash
yarn add pusher-js # or npm install pusher-js
```

If you use the broadcaster `socket.io`, you need to ensure that you have `socket.io-client` installed:

```bash
yarn add socket.io-client # or npm install socket.io-client
```

## Setup

1. Add `@nuxtjs/laravel-echo` dependency to your project

```bash
yarn add --dev @nuxtjs/laravel-echo # or npm install --save-dev @nuxtjs/laravel-echo
```

2. Add `@nuxtjs/laravel-echo` to the `buildModules` section of `nuxt.config.js`

```js
export default {
  buildModules: [
    // Simple usage
    '@nuxtjs/laravel-echo',

    // With options
    ['@nuxtjs/laravel-echo', { /* module options */ }]
  ]
}
```

:warning: If you are using Nuxt **< v2.9** you have to install the module as a `dependency` (No `--dev` or `--save-dev` flags) and use `modules` section in `nuxt.config.js` instead of `buildModules`.

### Using top level options

```js
export default {
  buildModules: [
    '@nuxtjs/laravel-echo'
  ],
  echo: {
    /* module options */
  }
}
```

## Options

### `auth`

- Type: `Object`
- Default:

```js
{
  headers: {}
}
```

You can define the `header` with a function:

```js
{
  async headers ({ app }) {
    const cookies = await app.$auth.$storage.getCookies()

    return {
      'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
    }
  }
}
```

### `authEndpoint`

- Type: `String`
- Default: `/broadcasting/auth`

See [https://laravel.com/docs/7.x/broadcasting#defining-authorization-routes](https://laravel.com/docs/7.x/broadcasting#defining-authorization-routes)

### `broadcaster`

- Type: `String`
- Default: `'null'`

You can use `'pusher'`, `'socket.io'` or `'null'`.

See [https://laravel.com/docs/broadcasting#driver-prerequisites](https://laravel.com/docs/broadcasting#driver-prerequisites)

### `host`

- Type: `String`
- Default: `null`

The host to connector `socket.io`.

### `key`

- Type: `String`
- Default: `null`

Your [Pusher Channels](https://pusher.com/channels) key.

### `namespace`

- Type: `String`
- Default: `App.Events`

See [https://laravel.com/docs/7.x/broadcasting#namespaces](https://laravel.com/docs/7.x/broadcasting#namespaces)

### `plugins`

- Type: `Array`
- Default: `null`

If you have plugins that need to access `$echo`, you can use `echo.plugins` option.

> **Note:** Plugins are pushed in client mode only (`ssr: false`).

`nuxt.config.js`

```js
export default {
  buildModules: [
    '@nuxtjs/laravel-echo'
  ],
  echo: {
     plugins: [ '~/plugins/echo.js' ]
  }
}
```

`plugins/echo.js`

```js
export default function ({ $echo }) {
  // Echo is available here
  console.log($echo)
}
```

### `authModule`

- Type: `Boolean`
- Default: `false`

Integration with [Auth Module](https://github.com/nuxt-community/auth-module).

### `connectOnLogin`

- Type: `Boolean`
- Default: `false`

Connect the connector on login, if `authModule` is set `true`.

### `disconnectOnLogout`

- Type: `Boolean`
- Default: `false`

Disconnect the connector on logout, if `authModule` is set `true`.

## Usage

This module inject `$echo` to your project:

```html
<template>
  <div>
    <h1>Orders</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$echo.channel('orders')
      .listen('OrderShipped', (e) => {
          console.log(e.order.name);
      });
  }
}
</script>
```

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/laravel-echo/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxtjs/laravel-echo

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/laravel-echo.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/laravel-echo

[github-actions-ci-src]: https://github.com/nuxt-community/laravel-echo/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-community/laravel-echo/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/laravel-echo.svg
[codecov-href]: https://codecov.io/gh/nuxt-community/laravel-echo

[license-src]: https://img.shields.io/npm/l/@nuxtjs/laravel-echo.svg
[license-href]: https://npmjs.com/package/@nuxtjs/laravel-echo
