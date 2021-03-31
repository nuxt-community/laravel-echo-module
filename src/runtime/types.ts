export type EchoOptions = Record<string, any>

export interface ModuleOptions extends EchoOptions {
  broadcaster?: string,
  encrypted?: boolean,
  plugins?: string[],
  authModule?: boolean,
  connectOnLogin?: boolean,
  disconnectOnLogout?: boolean,
  optionsPath?: string,
}
