import { env } from '../config/env'

interface AppRuntime {
  start: () => Promise<void>
}

export async function bootstrapApplication(): Promise<AppRuntime> {
  if (env.httpRuntime === 'nest') {
    const { createNestRuntime } = await import('./nest.bootstrap')
    return await createNestRuntime()
  }

  const { createFastifyRuntime } = await import('./fastify.bootstrap')
  return await createFastifyRuntime()
}
