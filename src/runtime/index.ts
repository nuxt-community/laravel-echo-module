import { Echo } from './echo'
import { ModuleOptions } from './types'

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $echo: Echo;
  }

  interface Context {
    $echo: Echo;
  }

  interface NuxtConfig {
    echo?: Partial<ModuleOptions>
  }

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
