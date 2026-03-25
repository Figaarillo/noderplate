import { MikroORM } from '@mikro-orm/core'
import { mikroORMConfig } from '@infrastructure/persistence/mikro-orm/config/mikro-orm.config'
import type { UserRepository } from '@core/users/domain/repositories/user.repository'
import { MikroORMUserRepository } from '@infrastructure/persistence/mikro-orm/repositories/user.repository'

export async function registerInfrastructure(container: Map<symbol, unknown>): Promise<void> {
  const orm = await MikroORM.init(mikroORMConfig)
  const em = orm.em.fork()

  const userRepository: UserRepository = new MikroORMUserRepository(em)
  container.set(Symbol.for('UserRepository'), userRepository)
}

export { TOKENS } from './tokens'
