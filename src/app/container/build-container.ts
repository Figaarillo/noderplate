import type { AppContainer } from './types'
import { createContainer } from './types'
import { registerInfrastructure } from './register-infrastructure'
import { registerUsers } from './register-users'

export async function buildContainer(): Promise<AppContainer> {
  const container = createContainer()

  await registerInfrastructure(container)
  registerUsers(container)

  return container
}
