interface AppRuntime {
  start: () => Promise<void>
}

export async function createNestRuntime(): Promise<AppRuntime> {
  return {
    async start() {
      // eslint-disable-next-line no-console
      console.log('NestJS bootstrap not yet implemented')
    }
  }
}
