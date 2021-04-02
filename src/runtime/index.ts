import { Echo } from './echo'
import { ModuleOptions } from './types'

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $echo: Echo;
  }

  interface Context {
    $echo: Echo;
  }

  // Nuxt 2.14+
  interface NuxtConfig {
    echo?: Partial<ModuleOptions>
  }

  // Nuxt 2.9 - 2.13
  interface Configuration {
    echo?: Partial<ModuleOptions>
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $echo: Echo
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface Store<S> {
    $echo: Echo
  }
}

export * from './echo'
