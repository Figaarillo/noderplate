import { env } from '../config/env'
import { createFastifyRuntime } from './fastify.bootstrap'
import { createNestRuntime } from './nest.bootstrap'

interface AppRuntime {
  start: () => Promise<void>
}

export async function bootstrapApplication(): Promise<AppRuntime> {
  if (env.httpRuntime === 'nest') {
    return await createNestRuntime()
  }

  return await createFastifyRuntime()
}
