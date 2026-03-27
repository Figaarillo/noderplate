import { env } from '../config/env'
import { checkDatabaseHealth } from './healthcheck'

interface AppRuntime {
  start: () => Promise<void>
}

export async function bootstrapApplication(): Promise<AppRuntime> {
  await checkDatabaseHealth()

  if (env.httpRuntime === 'fastify') {
    const { createFastifyRuntime } = await import('./fastify.bootstrap')
    return await createFastifyRuntime()
  } else if (env.httpRuntime === 'nest') {
    const { createNestRuntime } = await import('./nest.bootstrap')
    return await createNestRuntime()
  } else {
    throw new Error(`Unsupported HTTP runtime: ${env.httpRuntime}`)
  }
}
