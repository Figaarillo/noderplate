import { env } from '../config/env'

interface AppRuntime {
  start: () => Promise<void>
}

export async function bootstrapApplication(): Promise<AppRuntime> {
  if (env.httpRuntime === 'nest') {
    const { createNestRuntime } = await import('./nest.bootstrap')
    return await createNestRuntime()
  } else if (env.httpRuntime === 'fastify') {
    const { createFastifyRuntime } = await import('./fastify.bootstrap')
    return await createFastifyRuntime()
  } else {
    throw new Error(`Unsupported HTTP runtime: ${env.httpRuntime}`)
  }
}
