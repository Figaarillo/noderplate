import { MikroORM } from '@mikro-orm/core'
import mikroORMConfig from '../../features/users/infrastructure/mikro-orm/config/mikro-orm.config'
import type { AppContainer } from './types'

export async function registerInfrastructure(container: AppContainer): Promise<void> {
  const orm = await MikroORM.init(mikroORMConfig)
  const em = orm.em.fork()

  container.orm = orm
  container.em = em

  const { MikroORMUserRepository } = await import(
    '../../features/users/infrastructure/mikro-orm/repositories/user.repository'
  )

  container.repositories = {
    userRepository: new MikroORMUserRepository(em)
  }
}
